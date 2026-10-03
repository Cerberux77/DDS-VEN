import { requireSession } from "@/lib/session";
import { listDocuments } from "@/lib/documents";

export default async function DealRoom() {
  const session = await requireSession();
  const docs = await listDocuments(session);

  return (
    <main className="shell">
      <section className="hero">
        <div className="eyebrow">Authenticated · {session.email}</div>
        <h1>DDS Venezuela · Executive Deal Room</h1>
        <p>Los permisos se aplican documento por documento. PREVIEW significa revisión controlada; RELEASED identifica entregables liberados; SOURCE_RELEASED habilita fuente editable cuando exista autorización contractual.</p>
        <a className="button" href="/deal-room/fleet">Abrir Visual Fleet Configurator</a>
      </section>
      <div className="grid">
        {docs.map((d) => (
          <article className="card" key={d.id}>
            <span className={`badge ${d.releaseState.toLowerCase()}`}>PHASE {d.phase} · {d.releaseState}</span>
            <h3>{d.title}</h3>
            <p className="meta">{d.classification}</p>
            <p>Acceso: <strong>{d.grant}</strong>{d.canDownload ? " · descarga habilitable" : " · sin descarga"}</p>
            {d.grant !== "NONE"
              ? <a className="button" href={`/deal-room/documents/${d.id}`}>Abrir viewer</a>
              : <span className="badge">LOCKED</span>}
          </article>
        ))}
      </div>
    </main>
  );
}
