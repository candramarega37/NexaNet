import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request:Request){if(!await requireAdmin())return NextResponse.json({error:"Admin access required."},{status:403});const url=new URL(request.url);const page=Math.max(1,Number(url.searchParams.get("page"))||1);const take=25;const [total,students]=await Promise.all([db.user.count({where:{role:"STUDENT"}}),db.user.findMany({where:{role:"STUDENT"},select:{id:true,name:true,email:true,createdAt:true,_count:{select:{progress:true,attempts:true}}},orderBy:{createdAt:"desc"},skip:(page-1)*take,take})]);return NextResponse.json({students,total,page,pages:Math.ceil(total/take)});}
