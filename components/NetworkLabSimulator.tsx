"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { isSameSubnet, subnetInfo } from "@/lib/network.mjs";

type Device = { id: number; name: string; type: "PC" | "Laptop" | "Server" | "Switch" | "Router"; address: string; prefix: number };
const names: Record<string, string> = { star: "Star", bus: "Bus", mesh: "Mesh" };
const colors: Record<Device["type"], string> = { PC: "#e1f1e7", Laptop: "#e9e6f4", Server: "#f4e9dd", Switch: "#d9e8e0", Router: "#fce8d4" };

export default function NetworkLabSimulator() {
  const { t, locale } = useLanguage();
  const isEnglish = locale === "en";
  const [topology, setTopology] = useState("star");
  const [devices, setDevices] = useState<Device[]>([{ id: 1, name: "PC 01", type: "PC", address: "192.168.1.10", prefix: 24 }, { id: 2, name: "Server", type: "Server", address: "192.168.1.20", prefix: 24 }, { id: 3, name: "Laptop", type: "Laptop", address: "192.168.1.30", prefix: 24 }]);
  const [selectedDevice, setSelectedDevice] = useState(1);
  const [targetDevice, setTargetDevice] = useState(2);
  const [pingMessage, setPingMessage] = useState("");
  const [address, setAddress] = useState("192.168.1.10");
  const [prefix, setPrefix] = useState(24);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const topologyOptions = [
    { id: "star", icon: "✳", title: isEnglish ? "Star" : "Bintang", detail: isEnglish ? "Central switch" : "Switch pusat" },
    { id: "bus", icon: "↔", title: "Bus", detail: isEnglish ? "Shared backbone" : "Jalur bersama" },
    { id: "mesh", icon: "⌘", title: "Mesh", detail: isEnglish ? "Direct links" : "Koneksi langsung" },
  ];
  const edges = useMemo(() => {
    if (topology === "bus") return devices.slice(1).map((device, index) => [devices[index].id, device.id]);
    if (topology === "mesh") return devices.flatMap((device, index) => devices.slice(index + 1).map(other => [device.id, other.id]));
    return devices.map(device => [-1, device.id]);
  }, [devices, topology]);
  function addDevice(type: Device["type"]) {
    const id = Math.max(0, ...devices.map(device => device.id)) + 1;
    setDevices([...devices, { id, name: `${type} ${String(id).padStart(2, "0")}`, type, address: `192.168.1.${10 + id}`, prefix: 24 }]);
  }
  function updateDevice(id: number, update: Partial<Device>) { setDevices(current => current.map(device => device.id === id ? { ...device, ...update } : device)); }
  function selectDevice(id: number) {
    setSelectedDevice(id);
    if (targetDevice === id) setTargetDevice(devices.find(device => device.id !== id)?.id ?? id);
  }
  function testConnection() {
    const source = devices.find(device => device.id === selectedDevice);
    const target = devices.find(device => device.id === targetDevice);
    if (!source || !target) return;
    const sameNetwork = source.prefix === target.prefix && isSameSubnet(source.address, target.address, source.prefix);
    setPingMessage(sameNetwork
      ? isEnglish ? `Reply from ${target.address}: reachable on ${names[topology]} topology.` : `Balasan dari ${target.address}: perangkat dapat dijangkau pada topologi ${topologyOptions.find(item=>item.id===topology)?.title}.`
      : isEnglish ? `Request timed out: ${target.address} is not on the same subnet. Check IP address and prefix.` : `Waktu koneksi habis: ${target.address} berada di subnet berbeda. Periksa alamat IP dan prefix.`);
  }
  const subnet = subnetInfo(address, prefix);
  async function saveRun() {
    setSaving(true); setSaveMessage("");
    try {
      const response = await fetch("/api/labs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topology, devices, address, prefix }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Lab result not saved yet.");
      setSaveMessage(t("pages.actLabSaved"));
    } catch (error) { setSaveMessage(error instanceof Error ? error.message : "Lab result not saved yet."); }
    finally { setSaving(false); }
  }
  function point(id: number, index = -1): number[] {
    const deviceIndex = index >= 0 ? index : devices.findIndex(device => device.id === id);
    if (topology === "star") return id === -1 ? [300, 150] : [150 + deviceIndex % 4 * 100, 70 + Math.floor(deviceIndex / 4) * 150];
    if (topology === "bus") return [70 + deviceIndex * 460 / Math.max(devices.length - 1, 1), 150];
    const angle = (Math.PI * 2 * deviceIndex) / devices.length - Math.PI / 2;
    return [300 + Math.cos(angle) * Math.min(180, 45 * devices.length), 150 + Math.sin(angle) * 90];
  }
  return <div className="network-lab">
    <div className="lab-toolbar"><div className="lab-topology-control"><span>{isEnglish?"CHOOSE A TOPOLOGY":"PILIH TOPOLOGI"}</span><div className="lab-topology-options" role="group" aria-label={t("labs.topology")}>{topologyOptions.map(option=><button className={topology===option.id?"selected":""} key={option.id} type="button" aria-pressed={topology===option.id} onClick={()=>setTopology(option.id)}><b aria-hidden="true">{option.icon}</b><span>{option.title}<small>{option.detail}</small></span></button>)}</div></div><div className="lab-add"><span>{isEnglish?"ADD DEVICES":"TAMBAH PERANGKAT"}</span>{(["PC", "Laptop", "Server", "Switch", "Router"] as const).map(type => <button key={type} onClick={() => addDevice(type)}>+ {type}</button>)}</div></div>
    <div className="lab-canvas"><div className="lab-canvas-head"><span>{t("labs.topology").toUpperCase()} / {names[topology].toUpperCase()}</span><span>{devices.length} {t("labs.devices").toUpperCase()} · {edges.length} {t("labs.connections").toUpperCase()}</span></div><div className={`lab-network-view ${topology}`}><svg viewBox="0 0 600 300" role="img" aria-label={`${t("labs.topology")} ${names[topology]} · ${devices.length} ${t("labs.devices")}`}>
      <g>{edges.map(([a, b], index) => { const p1 = point(a), p2 = point(b); return <line key={index} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />; })}</g>
      {topology === "star" && <g transform="translate(300,150)"><rect x="-30" y="-24" width="60" height="48" rx="10" fill="#d9e8e0"/><text className="device-symbol" textAnchor="middle" y="6">▤</text><text className="device-name" textAnchor="middle" y="38">Switch</text></g>}
      {devices.map((device, index) => { const [x, y] = point(device.id, index); return <g key={device.id} transform={`translate(${x},${y})`} onClick={() => selectDevice(device.id)} role="button" tabIndex={0} aria-label={`Select ${device.name}`} style={{cursor:"pointer"}}><rect x="-30" y="-24" width="60" height="48" rx="10" stroke={selectedDevice===device.id?"#6d28d9":"transparent"} strokeWidth="3" fill={colors[device.type]}/><text className="device-symbol" textAnchor="middle" y="6">{device.type === "Server" || device.type === "Switch" ? "▤" : device.type === "Router" ? "↗" : "▣"}</text><text className="device-name" textAnchor="middle" y="38">{device.name}</text></g>; })}
    </svg></div></div>
    <section className="lab-device-panel"><div><span>{isEnglish?"DEVICE CONFIGURATION":"KONFIGURASI PERANGKAT"}</span><h2>{isEnglish?"Interfaces & addressing":"Antarmuka & pengalamatan"}</h2><p>{isEnglish?"Select a device in the topology, then configure its IPv4 address and prefix.":"Pilih perangkat pada topologi, lalu atur alamat IPv4 dan prefix-nya."}</p></div><div className="lab-device-list">{devices.map(device=><article key={device.id} className={selectedDevice===device.id?"selected":""}><button onClick={()=>selectDevice(device.id)}>{device.name}<small>{device.type}</small></button>{selectedDevice===device.id&&<div className="lab-device-fields"><label>IPv4 address<input value={device.address} onChange={event=>updateDevice(device.id,{address:event.target.value})}/></label><label>Prefix<select value={device.prefix} onChange={event=>updateDevice(device.id,{prefix:Number(event.target.value)})}>{Array.from({length:33},(_,index)=><option key={index} value={32-index}>/{32-index}</option>)}</select></label></div>}</article>)}</div><div className="lab-ping-controls"><label>{isEnglish?"Test from":"Uji dari"}<select value={selectedDevice} onChange={event=>selectDevice(Number(event.target.value))}>{devices.map(device=><option key={device.id} value={device.id}>{device.name}</option>)}</select></label><label>{isEnglish?"To device":"Ke perangkat"}<select value={targetDevice} onChange={event=>setTargetDevice(Number(event.target.value))}>{devices.filter(device=>device.id!==selectedDevice).map(device=><option key={device.id} value={device.id}>{device.name}</option>)}</select></label><button className="primary-button" disabled={devices.length<2} onClick={testConnection}>{isEnglish?"Run connectivity test":"Uji konektivitas"}</button></div>{pingMessage&&<p className="lab-ping-result" role="status">{pingMessage}</p>}</section>
    <div className="lab-observation"><b>{isEnglish?"TOPOLOGY INSIGHT":"INSIGHT TOPOLOGI"}</b><p>{topology === "star" ? isEnglish ? "Each device connects to a central switch. A single endpoint link affects one device, while a switch failure can interrupt the whole segment." : "Setiap perangkat terhubung ke switch pusat. Gangguan pada satu kabel biasanya berdampak pada satu perangkat, sedangkan switch yang gagal dapat memutus seluruh segmen." : topology === "bus" ? isEnglish ? "Devices share one backbone. A break or termination problem on the backbone can affect communication across the segment." : "Perangkat berbagi satu jalur utama. Jalur yang putus atau terminasi yang bermasalah dapat mengganggu komunikasi seluruh segmen." : isEnglish ? "Devices have direct paths to one another. This improves path choice and redundancy, but the number of links grows quickly." : "Setiap perangkat memiliki jalur langsung ke perangkat lain. Pilihan jalur dan redundansi meningkat, tetapi jumlah kabel juga cepat bertambah."}</p></div>
    <div className="subnet-tool"><div><span>{isEnglish?"NETWORK CALCULATOR":"KALKULATOR JARINGAN"}</span><h2>{isEnglish?"Calculate an IPv4 subnet":"Hitung subnet IPv4"}</h2><p>{isEnglish?"Enter an address and CIDR prefix to inspect its network range.":"Masukkan alamat dan prefix CIDR untuk melihat informasi subnet."}</p></div><div className="subnet-inputs"><label>IPv4 Address<input value={address} onChange={event => setAddress(event.target.value)} aria-label="IPv4 address"/></label><label>Prefix<select value={prefix} onChange={event => setPrefix(Number(event.target.value))}>{Array.from({ length: 33 }, (_, index) => <option key={index} value={32 - index}>/{32 - index}</option>)}</select></label></div>
      {subnet ? <div className="subnet-results"><div><small>NETWORK</small><b>{subnet.network}/{subnet.prefix}</b></div><div><small>SUBNET MASK</small><b>{subnet.subnetMask}</b></div><div><small>BROADCAST</small><b>{subnet.broadcast}</b></div><div><small>USABLE HOSTS</small><b>{subnet.usableHosts.toLocaleString("en-US")}</b></div></div> : <p className="form-error" role="alert">Enter a valid IPv4 address and prefix.</p>}
      <button className="primary-button" disabled={!subnet || saving} onClick={saveRun}>{saving ? t("common.loading") : t("common.save")}</button>{saveMessage && <p role="status" aria-live="polite">{saveMessage}</p>}
    </div>
  </div>;
}
