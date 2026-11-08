import { NextResponse } from "next/server";
import { z } from "zod";
import { requireTeacherOrAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({title:z.string().trim().min(3).max(120).optional(),description:z.string().trim().min(10).max(400).optional(),published:z.boolean().optional()}).refine(data=>Object.keys(data).length>0);
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireTeacherOrAdmin())return NextResponse.json({error:"Teacher/admin access required."},{status:403});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid update data."},{status:400});const {id}=await params;const exists=await db.quiz.findUnique({where:{id},select:{id:true}});if(!exists)return NextResponse.json({error:"Quiz not found."},{status:404});return NextResponse.json({quiz:await db.quiz.update({where:{id},data:parsed.data})});}
export async function DELETE(_request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireTeacherOrAdmin())return NextResponse.json({error:"Teacher/admin access required."},{status:403});const {id}=await params;const exists=await db.quiz.findUnique({where:{id},select:{id:true}});if(!exists)return NextResponse.json({error:"Quiz not found."},{status:404});await db.quiz.delete({where:{id}});return NextResponse.json({ok:true});}
