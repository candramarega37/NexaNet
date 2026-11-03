import { NextResponse } from "next/server";
import { compare,hash } from "bcryptjs";
import { z } from "zod";
import { clearSession, getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({currentPassword:z.string().min(8).max(128),newPassword:z.string().min(10).max(128)});
export async function POST(request:Request){const session=await getSessionUser();if(!session)return NextResponse.json({error:"Please sign in first."},{status:401});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"New password must be at least 10 characters."},{status:400});const user=await db.user.findUnique({where:{id:session.id}});if(!user||!await compare(parsed.data.currentPassword,user.passwordHash))return NextResponse.json({error:"Current password is incorrect."},{status:400});await db.user.update({where:{id:user.id},data:{passwordHash:await hash(parsed.data.newPassword,12),sessionVersion:{increment:1}}});await clearSession();return NextResponse.json({ok:true});}
