import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { subnetInfo } from "@/lib/network.mjs";

const inputSchema = z.object({
  topology: z.enum(["star", "bus", "mesh"]),
  devices: z.array(z.object({ name: z.string().trim().min(1).max(40), type: z.enum(["PC", "Laptop", "Server", "Switch", "Router"]), address: z.string().min(7).max(15), prefix: z.number().int().min(0).max(32) })).min(1).max(24),
  address: z.string().min(7).max(15),
  prefix: z.number().int().min(0).max(32),
});

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in to view lab history." }, { status: 401 });
  const runs = await db.activity.findMany({ where: { userId: user.id, kind: "lab-simulation" }, orderBy: { createdAt: "desc" }, take: 10, select: { id: true, detail: true, createdAt: true } });
  return NextResponse.json({ runs: runs.map(run => ({ id: run.id, createdAt: run.createdAt, ...JSON.parse(run.detail) })) });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sign in to save lab results." }, { status: 401 });
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid simulation data." }, { status: 400 }); }
  const parsed = inputSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Please check the simulation data." }, { status: 400 });
  if (parsed.data.devices.some(device => !subnetInfo(device.address, device.prefix))) return NextResponse.json({ error: "One or more device IPv4 settings are invalid." }, { status: 400 });
  const subnet = subnetInfo(parsed.data.address, parsed.data.prefix);
  if (!subnet) return NextResponse.json({ error: "Invalid IPv4 address." }, { status: 400 });
  const result = { topology: parsed.data.topology, devices: parsed.data.devices, subnet };
  const activity = await db.activity.create({ data: { userId: user.id, kind: "lab-simulation", detail: JSON.stringify(result) }, select: { id: true, createdAt: true } });
  return NextResponse.json({ saved: true, run: { ...activity, ...result } }, { status: 201 });
}
