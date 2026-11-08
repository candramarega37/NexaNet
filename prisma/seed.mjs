import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prePostTests } from "./pre-post-tests.mjs";
import { materials } from "./materials.mjs";

try { process.loadEnvFile(); } catch (error) { if (error?.code !== "ENOENT") throw error; }
const db = new PrismaClient();
const troubleshootingCases = [
  {
    slug: "no-internet", title: "No internet access", description: "Trace the connection from the affected device outward. Compare local link, IP configuration, gateway, public IP, and DNS before changing settings.",
    symptoms: ["Wi-Fi or Ethernet shows connected", "Websites do not load", "Other devices may or may not have the same problem"],
    steps: [
      { prompt: "Does the device have an active link and a valid IPv4 address?", check: "Check the link or Wi-Fi status, then inspect the address with ipconfig (Windows) or ip addr (Linux/macOS). An address beginning 169.254 usually indicates DHCP failed.", evidence: "Record the interface status, IPv4 address, subnet mask/prefix, and DHCP status.", yes: "The local link and address are present. Continue by testing the default gateway.", no: "Restore the physical or Wi-Fi link first. If the link is active but the address is 169.254.x.x, investigate DHCP and VLAN assignment." },
      { prompt: "Can the device reach its configured default gateway?", check: "Find the default gateway in the IP configuration and run ping <gateway-address>. If ICMP is blocked, verify the gateway's neighbor entry or test another known local service.", evidence: "Record the gateway address and ping/neighbor result; note whether other clients in the same subnet can reach it.", yes: "The local subnet is reachable. Test a public IP address to separate routing from name resolution.", no: "Check that the address and prefix match the subnet, then inspect the switch/VLAN path and gateway interface." },
      { prompt: "Can the device reach a known public IP address?", check: "Run ping 1.1.1.1 or test a known public service by IP. A failed ping alone is not conclusive because some networks block ICMP.", evidence: "Record the destination, response or timeout, and whether another public service works.", yes: "Internet routing likely works. Test DNS resolution for a domain name.", no: "Check the router's WAN status, upstream route, and firewall policy. Compare with a second device before changing the router." },
      { prompt: "Does DNS resolve a domain name correctly?", check: "Run nslookup example.com (or dig example.com) and compare the configured resolver with a known approved resolver.", evidence: "Record the queried name, DNS server, returned address, and error message.", yes: "DNS responds. Check the browser, proxy, TLS, or application if pages still fail.", no: "Inspect DNS settings supplied by DHCP, resolver reachability, and firewall rules for UDP/TCP 53." },
    ],
  },
  {
    slug: "ip-conflict", title: "Duplicate IPv4 address", description: "Identify whether two devices are claiming the same IPv4 address, then correct the source without creating another overlap.",
    symptoms: ["The operating system reports an address conflict", "Connectivity drops or moves between working and failing", "The issue began after a manual address or reservation change"],
    steps: [
      { prompt: "Does the warning identify a conflicting IPv4 address?", check: "Record the address from the warning or system event. Check whether the issue affects one VLAN/subnet or several.", evidence: "Record the duplicate address, affected device, VLAN/subnet, and time of the warning.", yes: "Use the reported address to identify both claimants. Check DHCP leases and static-address records.", no: "Confirm the device's current address and inspect ARP/neighbor entries for duplicate or changing MAC addresses." },
      { prompt: "Is the address statically configured or reserved on more than one device?", check: "Compare the device configuration, DHCP reservation list, and the DHCP dynamic pool. A static address should not be offered to another client.", evidence: "Record both device names/MAC addresses, address source, and the DHCP pool boundaries.", yes: "Assign one device a unique address outside the dynamic pool or create a single correct reservation.", no: "Look for a stale reservation, a second DHCP server, or an unmanaged device using the address." },
      { prompt: "Did the conflict stop after correcting one address source?", check: "Renew the affected lease if appropriate, clear stale neighbor state only when safe, and observe the same subnet for a short period.", evidence: "Record the change made, retest time, and whether the warning or packet loss returned.", yes: "Document the final address plan and keep static addresses outside the DHCP pool.", no: "Continue locating the second claimant by checking switch MAC tables, DHCP logs, and ARP observations." },
    ],
  },
  {
    slug: "slow-wifi", title: "Slow or unstable Wi-Fi", description: "Compare signal, airtime, and wired performance to determine whether the bottleneck is radio coverage, interference, client load, or the upstream connection.",
    symptoms: ["Performance changes by room or distance", "Many clients experience slowdowns at busy times", "Wi-Fi is slower or less stable than a wired connection"],
    steps: [
      { prompt: "Does performance improve close to the access point?", check: "Repeat the same speed and latency test near the AP and in the problem location. Keep the client, test server, and time as consistent as possible.", evidence: "Record location, signal strength/RSSI if available, speed, latency, and packet loss.", yes: "Coverage or obstacles are likely contributing. Check AP placement, walls, antenna orientation, and roaming overlap.", no: "Check channel airtime, AP load, client capability, and compare with a wired test." },
      { prompt: "Is the radio channel busy or the access point heavily loaded?", check: "Inspect channel utilization, neighboring networks, connected-client count, retries, and AP CPU/backhaul load.", evidence: "Record band, channel, channel width, utilization, client count, and retry/error rate.", yes: "Choose a cleaner channel and suitable channel width, then change one setting and retest.", no: "Check AP firmware, Ethernet uplink speed/errors, QoS, and the internet service path." },
      { prompt: "Is a wired device on the same network also slow?", check: "Run the same test from a wired device on the same router or switch and compare local latency with internet throughput.", evidence: "Record wired and wireless results, test destination, and test time.", yes: "Investigate the router uplink, WAN service, congestion, and shared traffic before tuning Wi-Fi.", no: "Focus on wireless coverage, interference, client drivers, and AP radio settings." },
    ],
  },
  {
    slug: "no-dhcp-address", title: "Client cannot obtain an IP address", description: "Follow the DHCP path from the client through the access switch or wireless VLAN to the DHCP server; distinguish a full pool from a broken relay or segment.",
    symptoms: ["The client has a 169.254.x.x address or no IPv4 address", "Other devices on the same subnet may still work", "The problem appears after connecting to a new port, SSID, or VLAN"],
    steps: [
      { prompt: "Is the client linked to the expected Ethernet port or Wi-Fi network?", check: "Verify link state, SSID, authentication, switch port status, and the VLAN assigned to that port or SSID.", evidence: "Record port/SSID, link state, VLAN, and whether the client authenticates successfully.", yes: "The access link is present. Check whether the client sends a DHCP request and receives an offer.", no: "Restore the physical link or correct the SSID, credentials, port state, or access VLAN first." },
      { prompt: "Does the DHCP scope have free addresses and a valid lease configuration?", check: "Inspect scope utilization, exclusions, lease duration, and server logs for the client's MAC address.", evidence: "Record scope range, free leases, client MAC, and any DHCP error or offer.", yes: "The scope has capacity. Check VLAN reachability and the DHCP relay/helper address.", no: "Safely reclaim stale leases or expand the scope after confirming the subnet has enough free addresses." },
      { prompt: "Can a DHCP request cross the VLAN to reach the DHCP server?", check: "Check DHCP relay/helper configuration and server logs. A packet capture can confirm Discover, Offer, Request, and Acknowledge messages.", evidence: "Record the relay address and which DHCP message is missing, if known.", yes: "The request path works. Check client-side filtering, duplicate DHCP servers, and lease acceptance.", no: "Correct the relay/helper or VLAN trunk path and verify return routing and DHCP firewall rules." },
    ],
  },
  {
    slug: "dns-failure", title: "DNS name resolution failure", description: "Determine whether the device can reach the network but cannot translate names into IP addresses, then identify the failing resolver or policy.",
    symptoms: ["Domain names fail while some IP-based services work", "Several applications report host or name lookup errors", "The issue may affect one device, one subnet, or the whole network"],
    steps: [
      { prompt: "Can the device reach its gateway and a known public IP service?", check: "Test the gateway and a public IP separately. Do not treat a blocked ping alone as proof that routing is down.", evidence: "Record the device address, gateway result, public-IP result, and whether another client behaves the same way.", yes: "Basic IP reachability is present. Query the configured DNS server directly.", no: "Resolve the IP route or gateway issue before diagnosing DNS." },
      { prompt: "Does a direct query to the configured DNS resolver return an answer?", check: "Run nslookup example.com <resolver-address> or dig @<resolver-address> example.com; note timeout, refusal, or returned record.", evidence: "Record resolver address, query name, response code, and response time.", yes: "The resolver is answering. Check cached records, search suffix, application proxy, or the specific domain's records.", no: "Check resolver service health, network reachability, and UDP/TCP 53 firewall rules." },
      { prompt: "Does an approved alternative resolver succeed from the same device?", check: "Use only a resolver allowed by the network policy. Compare the same query against the configured and approved alternative resolver.", evidence: "Record both resolver addresses and results; do not include credentials or private query data.", yes: "The original resolver or DHCP-provided DNS policy is the likely next area to inspect.", no: "Check DNS interception, outbound filtering, VPN policy, and whether the test domain is blocked." },
    ],
  },
];
const threeDModels = [
  { slug: "router", title: "Router", description: "A layer 3 device that connects different networks.", purpose: "Forwards packets based on the routing table and connects the LAN to other networks.", components: ["WAN port", "LAN port", "Status indicators", "Wireless antenna"], modelUrl: "/models/router.glb" },
  { slug: "switch", title: "Switch", description: "A device that connects devices within a local network.", purpose: "Learns MAC addresses and forwards frames to the destination port within the LAN.", components: ["Ethernet port", "Uplink port", "Link indicator", "MAC table"], modelUrl: "/models/switch.glb" },
  { slug: "access-point", title: "Access Point", description: "A device that provides wireless network access.", purpose: "Bridges Wi-Fi clients to the local network over an Ethernet connection.", components: ["Wi-Fi radio", "Antenna", "Ethernet port", "SSID"], modelUrl: "/models/access-point.glb" },
  { slug: "network-card", title: "Network Interface Card", description: "The interface that connects an end device to a wired or wireless network.", purpose: "Sends and receives network frames and provides the MAC address for the interface.", components: ["RJ45 port or Wi-Fi radio", "Controller", "MAC address", "Driver"], modelUrl: "/models/network-card.glb" },
  { slug: "rj45-connector", title: "RJ45 Connector", description: "A modular connector commonly used on copper Ethernet cables.", purpose: "Connects twisted-pair wires to the Ethernet port with the correct pin arrangement.", components: ["Eight contact positions", "Locking tab", "Copper contacts", "Crimp"], modelUrl: "/models/rj45-connector.glb" },
  { slug: "ethernet-cable", title: "Ethernet Cable", description: "Twisted-pair cable media for connecting network devices.", purpose: "Carries data signals between Ethernet interfaces within the cable category and length limits.", components: ["Wire pairs", "Insulation", "Outer jacket", "RJ45 connector"], modelUrl: "/models/ethernet-cable.glb" },
];
const extraQuizzes = [
  { slug:"osi-tcp-ip",title:"OSI and TCP/IP",description:"Learn layer functions and data encapsulation.",questions:[
    ["Which OSI layer handles logical addressing?",["Network","Physical","Presentation","Session"],0,"The Network layer handles IP addresses and path selection."],["What is the PDU at the Data Link layer called?",["Frame","Bit","Segment","Data"],0,"The Data Link layer wraps packets into frames."],["At which layer does the TCP protocol operate?",["Transport","Network","Data Link","Physical"],0,"TCP provides reliable transport communication."],["Which device commonly forwards frames based on MAC?",["Switch","Router","DSL modem","Wi-Fi repeater"],0,"A switch uses the MAC table on the LAN."],["How many layers does the TCP/IP model have in the commonly used mapping?",["4","3","5","7"],0,"The TCP/IP model is commonly mapped into Link, Internet, Transport, and Application."]]},
  { slug:"ipv4",title:"IPv4 Addressing",description:"Practice IPv4 addresses, network, and host.",questions:[
    ["How long is an IPv4 address?",["32 bits","16 bits","64 bits","128 bits"],0,"IPv4 consists of 32 bits."],["Is the address 192.168.1.10 in the private range?",["Yes","No","Only if /8","Only on WAN"],0,"192.168.0.0/16 is a private range."],["What is the function of the subnet mask?",["Separating the network and host portions","Encrypting packets","Determining the MAC address","Measuring bandwidth"],0,"The mask indicates the network and host portions."],["What does a host use the default gateway for?",["Sending packets to another network","Looking up the internet MAC address","Storing DNS","Assigning IP addresses automatically"],0,"The gateway is the next hop when the destination is on a different network."],["Can a network address be used as a host address?",["No","Yes, always","Only on switches","Only on IPv6"],0,"A network address identifies the subnet, not a host." ]]},
  { slug:"subnetting",title:"IPv4 Subnetting",description:"Check your understanding of prefixes, hosts, and subnet ranges.",questions:[
    ["How many usable hosts are in an IPv4 /26 subnet?",["62","64","30","126"],0,"/26 leaves 6 host bits: 64 total addresses minus network and broadcast."],["What is the subnet mask for /24?",["255.255.255.0","255.255.0.0","255.255.255.128","255.255.255.192"],0,"A /24 prefix means 24 mask bits set to one."],["In a regular IPv4 subnet, what is the broadcast address used for?",["Sending to all hosts in the subnet","Identifying the router","Network address","DNS address"],0,"Broadcast targets all hosts in the subnet."],["How many total addresses does a /30 prefix have?",["4","2","8","16"],0,"Two host bits produce four total addresses."],["As the prefix gets larger, the number of usable hosts generally?",["Gets smaller","Gets larger","Stays the same","Is unrelated"],0,"A larger prefix leaves fewer host bits." ]]},
  { slug:"routing-switching",title:"Routing and Switching",description:"Practice router, switch, and VLAN functions.",questions:[
    ["What information does a router use to forward packets?",["Routing table","File table","SSID","Cable serial number"],0,"A router picks the next hop from the routing table."],["What address does a layer 2 switch learn?",["Source MAC","Destination IP only","DNS","TCP port"],0,"A switch records the source MAC and ingress port."],["What is a VLAN used for?",["Creating logical segmentation on a LAN","Extending cable length","Replacing MAC addresses","Encrypting Wi-Fi"],0,"A VLAN logically separates broadcast domains."],["What is needed to connect different VLANs?",["A layer 3 device","A passive hub","An RJ45 connector","A repeater only"],0,"Inter-VLAN communication needs layer 3 routing."],["When is a default route used?",["When no more specific route exists","Whenever any frame is received","When DNS is down","When a host has no MAC"],0,"The default route is the choice when the destination matches no other route." ]]},
];

async function main() {
  const contentOnly = process.argv.includes("--content-only");
  let sampleStudents = [];
  if (!contentOnly) {
    const adminEmail = process.env.DEMO_ADMIN_EMAIL ?? "admin@nexanet.local";
    const studentEmail = process.env.DEMO_STUDENT_EMAIL ?? "siswa@nexanet.local";
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD ?? "AdminDemo!2026";
    const studentPassword = process.env.DEMO_STUDENT_PASSWORD ?? "BelajarDemo!2026";
    const teacherEmail = process.env.DEMO_TEACHER_EMAIL ?? "guru@nexanet.local";
    const teacherPassword = process.env.DEMO_TEACHER_PASSWORD ?? "GuruDemo!2026";
    await db.user.upsert({ where: { email: adminEmail }, update: {}, create: { name: "Demo Admin", email: adminEmail, passwordHash: await bcrypt.hash(adminPassword, 12), role: "ADMIN" } });
    await db.user.upsert({ where: { email: teacherEmail }, update: { className: "XI TKJ 1", major: "Computer and Network Engineering" }, create: { name: "Demo Teacher", email: teacherEmail, passwordHash: await bcrypt.hash(teacherPassword, 12), role: "TEACHER", className: "XI TKJ 1", major: "Computer and Network Engineering" } });
    await db.user.upsert({ where: { email: studentEmail }, update: { className: "XI TKJ 1", major: "Computer and Network Engineering" }, create: { name: "Demo Student", email: studentEmail, passwordHash: await bcrypt.hash(studentPassword, 12), role: "STUDENT", className: "XI TKJ 1", major: "Computer and Network Engineering" } });
    sampleStudents = [2, 3].map(index => ({ email: process.env[`DEMO_STUDENT_${index}_EMAIL`] ?? `siswa${index}@nexanet.local`, password: process.env[`DEMO_STUDENT_${index}_PASSWORD`] ?? `BelajarSiswa${index}!2026`, name: `Demo Student ${index}` }));
    for (const [index, student] of sampleStudents.entries()) await db.user.upsert({ where: { email: student.email }, update: { className: index === 0 ? "XI TKJ 2" : "X TKJ 1", major: "Computer and Network Engineering" }, create: { name: student.name, email: student.email, passwordHash: await bcrypt.hash(student.password, 12), role: "STUDENT", className: index === 0 ? "XI TKJ 2" : "X TKJ 1", major: "Computer and Network Engineering" } });
  }
  for (const material of materials) {
    await db.material.upsert({ where: { slug: material.slug }, update: material, create: material });
  }
  for (const video of [
    { title: "Introduction to Computer Networks", description: "Network concepts, LAN/WAN/MAN/PAN types, and topologies. Video in Indonesian by arya prawirandika.", durationMins: 16, videoUrl: "https://www.youtube.com/watch?v=1R7TtHeN5SI" },
    { title: "Understanding the OSI Model and Protocols", description: "Functions of the seven OSI layers, protocol examples, and their use in troubleshooting. Video in Indonesian by Sinau O Rek.", durationMins: 16, videoUrl: "https://www.youtube.com/watch?v=AUItPEkLb5c" },
    { title: "IPv4 and Basic Subnetting", description: "Basics of subnet addresses, network addresses, and IPv4 addressing. Video in Indonesian by Indonesia Belajar.", durationMins: 19, videoUrl: "https://www.youtube.com/watch?v=L8y-zL9hSbM" },
    { title: "IPv4: Network Address", description: "Calculating the network address from an IPv4 address and prefix. Part of the addressing series by Indonesia Belajar.", durationMins: 15, videoUrl: "https://www.youtube.com/watch?v=tp7MdMFJ0n0" },
    { title: "IPv4: Host Addresses and IP Ranges", description: "Determining the usable host address range within a subnet. Part of the addressing series by Indonesia Belajar.", durationMins: 15, videoUrl: "https://www.youtube.com/watch?v=s6PSmcSoDC4" },
    { title: "IPv4 Addressing Series: Video 7", description: "Continuation of the basic computer networking addressing material. Video in Indonesian by Indonesia Belajar.", durationMins: 15, videoUrl: "https://www.youtube.com/watch?v=AOlICpSDfIY" },
    { title: "Virtual LAN (VLAN)", description: "Introduction to Virtual LAN concepts and configuration. Tutorial in Indonesian.", durationMins: 20, videoUrl: "https://www.youtube.com/watch?v=TPSdO9tNQY0" },
    { title: "Static Routing Concepts", description: "Basic static routing concepts and checking the routing table on a Cisco router. Indonesia Belajar video.", durationMins: 20, videoUrl: "https://www.youtube.com/watch?v=pZXqzPCD3cM" },
    { title: "Static Routing Practice in Packet Tracer", description: "Static routing configuration practice using the CLI in Cisco Packet Tracer. Tutorial in Indonesian.", durationMins: 20, videoUrl: "https://www.youtube.com/watch?v=zIdXGoaMRIg" },
    { title: "CCNA: Networking Today (English)", description: "Supplementary English language introduction to network components and modern networking concepts.", durationMins: 80, videoUrl: "https://www.youtube.com/watch?v=vOEJqFWLT70" },
  ]) await db.video.upsert({ where: { title: video.title }, update: { description: video.description, durationMins: video.durationMins, videoUrl: video.videoUrl }, create: video });
  for (const item of troubleshootingCases) await db.troubleshootingCase.upsert({ where: { slug: item.slug }, update: { ...item, symptoms: JSON.stringify(item.symptoms), steps: JSON.stringify(item.steps) }, create: { ...item, symptoms: JSON.stringify(item.symptoms), steps: JSON.stringify(item.steps), published: true } });
  for (const item of threeDModels) {
    const model = await db.threeDModel.upsert({ where: { slug: item.slug }, update: { ...item, components: JSON.stringify(item.components) }, create: { ...item, components: JSON.stringify(item.components), published: true } });
    if (await db.threeDHotspot.count({ where: { threeDModelId: model.id } }) === 0) await db.threeDHotspot.createMany({ data: item.components.slice(0, 4).map((component, sortOrder) => ({ threeDModelId: model.id, title: component, description: `${component} is a part that helps the ${item.title} perform its function.`, example: `Observe the function of ${component} on the ${item.title} device.`, x: (sortOrder - 1.5) * 0.18, y: 0.2, z: 0.2, sortOrder })) });
  }
  for (const item of [...extraQuizzes, ...prePostTests]) {
    const extra = await db.quiz.upsert({ where: { slug: item.slug }, update: { title: item.title, description: item.description, published: true }, create: { slug: item.slug, title: item.title, description: item.description, published: true } });
    const existing = await db.question.count({ where: { quizId: extra.id } });
    if (existing === 0) {
      await db.question.createMany({ data: item.questions.map(([prompt, options, correctAnswer, explanation]) => ({ quizId: extra.id, prompt, options: JSON.stringify(options), correctAnswer, explanation })) });
    } else if (existing !== item.questions.length) {
      await db.question.deleteMany({ where: { quizId: extra.id } });
      await db.question.createMany({ data: item.questions.map(([prompt, options, correctAnswer, explanation]) => ({ quizId: extra.id, prompt, options: JSON.stringify(options), correctAnswer, explanation })) });
    }
  }
  const quiz = await db.quiz.upsert({ where: { slug: "dasar-jaringan" }, update: {}, create: { slug: "dasar-jaringan", title: "Basic Computer Networks", description: "Check your understanding of basic networking concepts." } });
  if (await db.question.count({ where: { quizId: quiz.id } }) === 0) {
    await db.question.createMany({ data: [
      { quizId: quiz.id, prompt: "What is the main purpose of a computer network?", options: JSON.stringify(["Connecting devices so they can exchange data", "Replacing the operating system", "Speeding up the processor", "Removing the need for addresses"]), correctAnswer: 0, explanation: "Networks let devices exchange data and share resources." },
      { quizId: quiz.id, prompt: "Which device commonly connects devices within a LAN?", options: JSON.stringify(["Switch", "Scanner", "Speaker", "Projector"]), correctAnswer: 0, explanation: "A switch forwards frames between devices in a LAN." },
      { quizId: quiz.id, prompt: "Which protocol provides logical addresses on an IP network?", options: JSON.stringify(["IP", "HDMI", "USB", "SATA"]), correctAnswer: 0, explanation: "IP provides logical addressing and helps route packets." },
    ] });
  }
  const basicCount = await db.question.count({ where: { quizId: quiz.id } });
  if (basicCount < 5) await db.question.createMany({ data: [
    { quizId: quiz.id, prompt: "Which device connects different networks?", options: JSON.stringify(["Router", "Layer 2 switch", "NIC", "Patch panel"]), correctAnswer: 0, explanation: "A router forwards packets between networks." },
    { quizId: quiz.id, prompt: "What are the rules for communication between network devices called?", options: JSON.stringify(["Protocol", "Topology", "Connector", "Graphical interface"]), correctAnswer: 0, explanation: "Protocols define the rules for data exchange." },
  ].slice(0, 5 - basicCount) });
  const sampleMaterial = await db.material.findUnique({ where: { slug: "dasar-jaringan-komputer" } });
  if (!contentOnly && sampleMaterial) {
    const sampleUsers = await db.user.findMany({ where: { email: { in: sampleStudents.map(student => student.email) } }, select: { id: true } });
    for (const [index, sampleUser] of sampleUsers.entries()) {
      await db.materialProgress.upsert({ where: { userId_materialId: { userId: sampleUser.id, materialId: sampleMaterial.id } }, update: {}, create: { userId: sampleUser.id, materialId: sampleMaterial.id, status: index === 0 ? "IN_PROGRESS" : "COMPLETED", percent: index === 0 ? 45 : 100, completedAt: index === 0 ? null : new Date() } });
      if (await db.quizAttempt.count({ where: { userId: sampleUser.id, quizId: quiz.id } }) === 0) await db.quizAttempt.create({ data: { userId: sampleUser.id, quizId: quiz.id, score: index === 0 ? 80 : 100, answers: JSON.stringify([0, 0, 0, 0, 0]) } });
    }
  }
}

main().finally(() => db.$disconnect());
