import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/session";
import { sql } from "@/lib/db";
import { audit } from "@/lib/audit";
export async function POST(){const s=await getSessionContext();if(!s)return NextResponse.json({error:"Unauthorized"},{status:401});const db=sql();const t=await db`select id::text,version from terms_versions where active=true order by effective_at desc limit 1` as unknown as Array<{id:string,version:string}>;if(!t[0])return NextResponse.json({error:"No active terms"},{status:409});await db`insert into terms_acceptances(user_id,terms_version_id,session_id) values(${s.userId}::uuid,${t[0].id}::uuid,${s.sessionId}::uuid) on conflict do nothing`;await audit({sessionId:s.sessionId,userId:s.userId,event:"TERMS_ACCEPTED",metadata:{version:t[0].version}});return NextResponse.json({ok:true});}
