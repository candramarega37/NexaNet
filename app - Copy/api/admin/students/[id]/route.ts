import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

const schema=z.object({role:z.enum(["STUDENT","ADMIN"])});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){const admin=await requireAdmin();if(!admin)return NextResponse.json({error:"Admin access required."},{status:403});const {id}=await params;if(admin.id===id)return NextResponse.json({error:"You cannot change the role of the account you are currently using."},{status:400});let body:unknown;try{body=await request.json();}catch{return NextResponse.json({error:"Invalid data format."},{status:400});}const parsed=schema.safeParse(body);if(!parsed.success)return NextResponse.json({error:"Invalid role."},{status:400});const target=await db.user.findUnique({where:{id},select:{id:true,role:true}});if(!target)return NextResponse.json({error:"User not found."},{status:404});if(target.role==="ADMIN"&&parsed.data.role==="STUDENT"){const adminCount=await db.user.count({where:{role:"ADMIN"}});if(adminCount<=1)return NextResponse.json({error:"At least one admin must remain active."},{status:400});}return NextResponse.json({user:await db.user.update({where:{id},data:{role:parsed.data.role},select:{id:true,name:true,email:true,role:true}})});}
