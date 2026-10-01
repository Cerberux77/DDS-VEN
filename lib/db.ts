import "server-only";
import { neon } from "@neondatabase/serverless";

function databaseUrl() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is required");
  return value;
}

export function sql() {
  return neon(databaseUrl());
}
