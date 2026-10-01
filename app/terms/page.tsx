import { requireSession } from "@/lib/session";
import { TermsForm } from "@/components/TermsForm";
import { sql } from "@/lib/db";
export default async function TermsPage(){
  const session=await requireSession(false); if(session.termsAccepted) return <main className="shell"><p>Los términos vigentes ya fueron aceptados.</p><a className="button" href="/deal-room">Continuar</a></main>;
  const db=sql(); const rows=await db`select version, body from terms_versions where active=true order by effective_at desc limit 1` as unknown as Array<{version:string,body:string}>;
  const t=rows[0];
  return <main className="shell"><section className="hero terms"><div className="eyebrow">Controlled Review Terms · {t?.version ?? "sin versión activa"}</div><h1>Condiciones de revisión controlada</h1><p>{t?.body ?? "No existe una versión activa de términos. Contacte a SMSMantis."}</p><div className="notice"><strong>Importante:</strong> el acceso PREVIEW permite evaluación y coordinación únicamente. No constituye entrega contractual, transferencia de propiedad ni liberación de archivos fuente.</div>{t && <TermsForm />}</section></main>;
}
