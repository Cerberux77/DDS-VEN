import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { signSession } from "@/lib/crypto";
import { SESSION_COOKIE } from "@/lib/session";
import { audit } from "@/lib/audit";
import { notifyAccess } from "@/lib/notify";

const cleanEmail=(v:unknown)=>String(v??"").trim().toLowerCase();
const cleanPhone=(v:unknown)=>String(v??"").replace(/[^+0-9]/g,"").slice(0,24);
export async function POST(req:Request){
 const body=await req.json().catch(()=>null) as {email?:string,phone?:string,invite?:string}|null;
 const email=cleanEmail(body?.email),phone=cleanPhone(body?.phone),invite=String(body?.invite??"");
 if(!email.includes("@")||phone.length<7||invite.length<12)return NextResponse.json({error:"Datos de acceso inválidos"},{status:400});
 const db=sql(); const hash=createHash("sha256").update(invite).digest("hex");
 const invitations=await db`select id::text, email from invitations where token_hash=${hash} and used_at is null and expires_at>now() limit 1` as unknown as Array<{id:string,email:string|null}>;
 const inv=invitations[0]; if(!inv || (inv.email && inv.email.toLowerCase()!==email)) return NextResponse.json({error:"Invitación inválida o expirada"},{status:403});
 const users=await db`insert into users(email,phone) values(${email},${phone}) on conflict(email) do update set phone=excluded.phone, updated_at=now() returning id::text` as unknown as Array<{id:string}>;
 const userId=users[0].id; await db`insert into memberships(user_id,organization_id,role) select ${userId}::uuid,id,'VIEWER' from organizations where slug='smsmantis' on conflict(user_id) do nothing`;
 await db`update invitations set used_at=now(), used_by=${userId}::uuid where id=${inv.id}::uuid`;
 const sessionId=randomUUID(); await db`insert into access_sessions(id,user_id,expires_at) values(${sessionId}::uuid,${userId}::uuid,now()+interval '12 hours')`;
 const response=NextResponse.json({ok:true}); response.cookies.set(SESSION_COOKIE,signSession(sessionId,userId),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:60*60*12});
 await audit({sessionId,userId,event:"LOGIN",metadata:{email}}); await notifyAccess({type:"LOGIN",email,phone,sessionId}); return response;
}
