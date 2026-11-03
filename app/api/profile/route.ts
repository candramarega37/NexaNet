import { NextResponse } from "next/server";
import { z } from "zod";
import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({name:z.string().trim().min(2).max(80),className:z.string().trim().max(80).optional(),major:z.string().trim().max(100).optional()});
export async function PATCH(request:Request){const user=await getSessionUser();if(!user)return NextResponse.json({error:"Please sign in first."},{status:401});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid name or class/major data."},{status:400});return NextResponse.json({user:await db.user.update({where:{id:user.id},data:{name:parsed.data.name,className:parsed.data.className?.trim()||null,major:parsed.data.major?.trim()||null},select:{id:true,name:true,email:true,role:true,className:true,major:true}})});}
