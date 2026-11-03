import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const httpsUrl=z.string().url().refine(value=>new URL(value).protocol==="https:");
const schema=z.object({title:z.string().trim().min(3).max(120),description:z.string().trim().min(10).max(400),durationMins:z.number().int().min(1).max(600),videoUrl:httpsUrl.optional().or(z.literal("")),published:z.boolean().default(false)});
export async function GET(){if(!await requireAdmin())return NextResponse.json({error:"Admin access required."},{status:403});return NextResponse.json({videos:await db.video.findMany({orderBy:{createdAt:"desc"}})});}
export async function POST(request:Request){if(!await requireAdmin())return NextResponse.json({error:"Admin access required."},{status:403});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Check the video data again."},{status:400});const video=await db.video.create({data:{...parsed.data,videoUrl:parsed.data.videoUrl||null}});return NextResponse.json({video},{status:201});}
