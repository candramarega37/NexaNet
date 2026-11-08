import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTeacherOrAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({slug:z.string().trim().min(3).max(90).regex(/^[a-z0-9-]+$/),title:z.string().trim().min(3).max(120),description:z.string().trim().min(10).max(400),published:z.boolean().default(false)});
export async function GET(){if(!await requireTeacherOrAdmin())return NextResponse.json({error:"Teacher/admin access required."},{status:403});return NextResponse.json({quizzes:await db.quiz.findMany({orderBy:{title:"asc"},include:{_count:{select:{questions:true,attempts:true}}}})});}
export async function POST(request:Request){if(!await requireTeacherOrAdmin())return NextResponse.json({error:"Teacher/admin access required."},{status:403});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Check the quiz data again."},{status:400});const quiz=await db.quiz.create({data:parsed.data});return NextResponse.json({quiz},{status:201});}
