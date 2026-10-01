import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionContext, SESSION_COOKIE } from "@/lib/session";
import { sql } from "@/lib/db";
import { audit } from "@/lib/audit";
export async function POST(){const s=await getSessionContext(); if(s){const db=sql();await db`update access_sessions set revoked_at=now() where id=${s.sessionId}::uuid`;await audit({sessionId:s.sessionId,userId:s.userId,event:"LOGOUT"});}const r=NextResponse.json({ok:true});r.cookies.set(SESSION_COOKIE,"",{httpOnly:true,expires:new Date(0),path:"/"});return r;}
