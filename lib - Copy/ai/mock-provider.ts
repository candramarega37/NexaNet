import type { AiProvider, TutorRequest } from "@/lib/ai/types";

export const mockProvider: AiProvider = {
  mode: "mock",
  async respond({ prompt, context }: TutorRequest) {
    const text = prompt.toLowerCase();
    if (context === "quiz-hint") return `Study hint: ${text}. Try recalling the function of the concept covered and explain it in your own words. This demo hint does not see the answer key.`;
    if (context === "troubleshooting") return "Start from the closest layer: check power and cables, then the IP address and subnet mask. After that test the gateway, then check DNS. Change one thing at a time and record the result.";
    if (text.includes("subnet")) return "Subnetting splits a network into several smaller parts. Start by looking at the CIDR prefix: the prefix sets how many bits are network bits. How many hosts do you need to connect?";
    if (text.includes("osi")) return "The OSI model helps us split network communication into seven layers. When analyzing a problem, start from the physical connection, then move up to addressing, transport, and applications.";
    if (text.includes("router") || text.includes("routing")) return "Routers forward packets between networks using a routing table. Client devices usually send packets outside the local network to the default gateway.";
    return "Demo AI mode is on. I can help explain networking concepts, OSI, IPv4, subnetting, routing, and troubleshooting. Tell me which part you want to understand better.";
  },
};
