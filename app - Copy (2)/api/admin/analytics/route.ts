import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(){
  if(!await requireAdmin())return NextResponse.json({error:"Admin access required."},{status:403});
  const now=new Date();const sixMonthsAgo=new Date(now.getFullYear(),now.getMonth()-5,1);
  const [students,materials,videos,quizzes,troubleshootingCases,threeDModels,attemptCount,completedMaterials,totalProgress,average,attempts,completions]=await Promise.all([
    db.user.count({where:{role:"STUDENT"}}),db.material.count({where:{published:true}}),db.video.count({where:{published:true}}),db.quiz.count({where:{published:true}}),db.troubleshootingCase.count({where:{published:true}}),db.threeDModel.count({where:{published:true}}),db.quizAttempt.count(),db.materialProgress.count({where:{status:"COMPLETED"}}),db.materialProgress.count(),db.quizAttempt.aggregate({_avg:{score:true}}),db.quizAttempt.findMany({where:{completedAt:{gte:sixMonthsAgo}},select:{score:true,completedAt:true,quiz:{select:{title:true}}},orderBy:{completedAt:"desc"},take:5000}),db.materialProgress.findMany({where:{status:"COMPLETED",completedAt:{gte:sixMonthsAgo}},select:{completedAt:true},orderBy:{completedAt:"desc"},take:5000})
  ]);
  const monthMap=new Map<string,{month:string;attempts:number;averageScore:number;completedMaterials:number;scoreTotal:number}>();
  for(let offset=0;offset<6;offset++){const date=new Date(now.getFullYear(),now.getMonth()-5+offset,1);const key=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}`;monthMap.set(key,{month:date.toLocaleDateString("id-ID",{month:"short",year:"2-digit"}),attempts:0,averageScore:0,completedMaterials:0,scoreTotal:0});}
  for(const attempt of attempts){const key=`${attempt.completedAt.getFullYear()}-${String(attempt.completedAt.getMonth()+1).padStart(2,"0")}`;const month=monthMap.get(key);if(month){month.attempts++;month.scoreTotal+=attempt.score;month.averageScore=Math.round(month.scoreTotal/month.attempts);}}
  for(const progress of completions){if(!progress.completedAt)continue;const key=`${progress.completedAt.getFullYear()}-${String(progress.completedAt.getMonth()+1).padStart(2,"0")}`;const month=monthMap.get(key);if(month)month.completedMaterials++;}
  const topicMap=new Map<string,{title:string;count:number;total:number}>();for(const attempt of attempts){const row=topicMap.get(attempt.quiz.title)??{title:attempt.quiz.title,count:0,total:0};row.count++;row.total+=attempt.score;topicMap.set(attempt.quiz.title,row);}
  const weakTopics=[...topicMap.values()].map(row=>({title:row.title,attempts:row.count,averageScore:Math.round(row.total/row.count)})).sort((a,b)=>a.averageScore-b.averageScore).slice(0,5);
  return NextResponse.json({students,materials,videos,quizzes,troubleshootingCases,threeDModels,quizAttempts:attemptCount,completedMaterials,totalProgress,cohortCompletionPercent:students&&materials?Math.round(completedMaterials/(students*materials)*100):0,averageQuizScore:Math.round(average._avg.score??0),monthly:[...monthMap.values()].map(({month,attempts,averageScore,completedMaterials})=>({month,attempts,averageScore,completedMaterials})),weakTopics});
}
