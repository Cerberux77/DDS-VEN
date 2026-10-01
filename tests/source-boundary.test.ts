import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
test("no sensitive source file is under public",()=>{
 const publicDir=path.join(root,"public");
 if(!fs.existsSync(publicDir)) return;
 const names=fs.readdirSync(publicDir,{recursive:true}).map(String);
 assert.equal(names.some(n=>/\.(xlsx|pptx|docx|html)$/i.test(n)),false);
});
test("preview route does not call readSource",()=>{
 const p=fs.readFileSync(path.join(root,"app/api/documents/[id]/preview/route.ts"),"utf8");
 assert.equal(p.includes("readSource"),false);
 assert.equal(p.includes("sourceStorageKey"),false);
});
test("download route requires DOWNLOAD_SOURCE authorization",()=>{
 const p=fs.readFileSync(path.join(root,"app/api/documents/[id]/download/route.ts"),"utf8");
 assert.equal(p.includes('authorize(s,d,"DOWNLOAD_SOURCE")'),true);
});
