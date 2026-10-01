import Link from "next/link";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/session";
import { authorize, getDocument, listDocuments } from "@/lib/documents";
import { Watermark } from "@/components/Watermark";
import { PreviewGuard } from "@/components/PreviewGuard";
import { notifyAccess } from "@/lib/notify";
import { audit } from "@/lib/audit";

type PreviewMaterial = {
  title: string;
  type?: string;
  status?: string;
  description?: string;
};

type IntelligenceItem = {
  label: string;
  value: string;
  note?: string;
};

function arrayOfRecords(value: unknown): Array<Record<string, unknown>> {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    : [];
}

function materialFrom(value: Record<string, unknown>): PreviewMaterial {
  return {
    title: String(value.title ?? "Material de revisión"),
    type: value.type ? String(value.type) : undefined,
    status: value.status ? String(value.status) : undefined,
    description: value.description ? String(value.description) : undefined,
  };
}

function intelligenceFrom(value: Record<string, unknown>): IntelligenceItem {
  return {
    label: String(value.label ?? "Dato de inteligencia"),
    value: String(value.value ?? "—"),
    note: value.note ? String(value.note) : undefined,
  };
}

export default async function DocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await requireSession();
  const [doc, allDocs] = await Promise.all([getDocument(session, id), listDocuments(session)]);
  if (!doc) notFound();

  const decision = authorize(session, doc, "VIEW_PREVIEW");
  if (!decision.allowed) {
    await audit({
      sessionId: session.sessionId,
      userId: session.userId,
      documentId: id,
      event: "ACCESS_DENIED",
      reason: decision.reason,
    });
    return (
      <main className="shell">
        <nav className="toolbar" aria-label="Navegación de Deal Room">
          <Link className="ghostButton" href="/deal-room">← Volver al Deal Room</Link>
        </nav>
        <section className="hero">
          <h1>Acceso restringido</h1>
          <p>Este material todavía no está liberado para su sesión.</p>
        </section>
      </main>
    );
  }

  await audit({
    sessionId: session.sessionId,
    userId: session.userId,
    documentId: id,
    event: "VIEW",
    reason: decision.reason,
  });
  await notifyAccess({
    type: "VIEW",
    email: session.email,
    documentId: id,
    sessionId: session.sessionId,
  });

  const p = doc.previewPayload ?? {};
  const materials = arrayOfRecords(p.materials).map(materialFrom);
  const intelligence = arrayOfRecords(p.marketIntelligence).map(intelligenceFrom);
  const visibleDocs = allDocs.filter((item) => item.grant !== "NONE" && !item.revoked);
  const currentIndex = visibleDocs.findIndex((item) => item.id === id);
  const previous = currentIndex > 0 ? visibleDocs[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < visibleDocs.length - 1 ? visibleDocs[currentIndex + 1] : null;
  const canDownloadSource = authorize(session, doc, "DOWNLOAD_SOURCE").allowed;

  return (
    <main className="shell dealRoomDocument">
      <nav className="toolbar" aria-label="Navegación de Deal Room">
        <Link className="ghostButton" href="/deal-room">← Atrás</Link>
        <div className="breadcrumbs" aria-label="Breadcrumb">
          <Link href="/deal-room">Deal Room</Link><span>/</span><span>Documents</span><span>/</span><strong>{doc.title}</strong>
        </div>
        <div className="pager">
          {previous ? <Link className="ghostButton" href={`/deal-room/documents/${previous.id}`}>← Anterior</Link> : <span />}
          {next ? <Link className="ghostButton" href={`/deal-room/documents/${next.id}`}>Siguiente →</Link> : <span />}
        </div>
      </nav>

      <section className="hero packageHero" id="overview">
        <div className="eyebrow">PHASE {doc.phase} · {doc.releaseState} · {doc.classification}</div>
        <h1>{doc.title}</h1>
        <p>{String(p.summary ?? "Material curado para revisión ejecutiva. Los archivos fuente y fórmulas permanecen restringidos.")}</p>
        <p className="meta">Session {session.sessionId}</p>
      </section>

      <div className="documentLayout">
        <aside className="sideNav" aria-label="Índice del documento">
          <div className="sideNavTitle">Índice</div>
          <a href="#overview">Overview</a>
          <a href="#materials">Included materials</a>
          {intelligence.length > 0 && <a href="#market-intelligence">Market intelligence</a>}
          <a href="#access-policy">Access policy</a>
          <Link href="/deal-room">Todos los documentos</Link>
        </aside>

        <PreviewGuard>
          <section className="viewer restricted">
            <Watermark email={session.email} sessionId={session.sessionId} />
            <div className="content">
              <div className="notice">
                <strong>CONTROLLED REVIEW.</strong> Esta representación es derivada. El archivo fuente no se entrega al navegador en PREVIEW.
              </div>

              <section className="reviewSection">
                <h2>{String(p.heading ?? doc.title)}</h2>
                {Array.isArray(p.items) && (
                  <ul className="reviewList">
                    {p.items.map((item, index) => <li key={index}>{String(item)}</li>)}
                  </ul>
                )}
              </section>

              <section className="reviewSection" id="materials">
                <div className="sectionHeading">
                  <div>
                    <div className="eyebrow">CONTROLLED PACKAGE</div>
                    <h2>Included materials</h2>
                  </div>
                  <span className="badge preview">SOURCE SAFE</span>
                </div>

                {materials.length > 0 ? (
                  <div className="materialList">
                    {materials.map((material, index) => {
                      const status = (material.status ?? "PREVIEW").toUpperCase();
                      const restricted = status === "RESTRICTED";
                      return (
                        <article className="materialCard" key={`${material.title}-${index}`}>
                          <div>
                            <div className="materialMeta">{material.type ?? "Derived review material"}</div>
                            <h3>{material.title}</h3>
                            {material.description && <p>{material.description}</p>}
                          </div>
                          <span className={`statusPill ${restricted ? "restrictedPill" : "previewPill"}`}>{status}</span>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="emptyState">
                    <strong>Preview package disponible.</strong>
                    <p>Los materiales individuales todavía no tienen representación derivada publicada. El archivo fuente permanece restringido.</p>
                  </div>
                )}
              </section>

              {intelligence.length > 0 && (
                <section className="reviewSection" id="market-intelligence">
                  <div className="sectionHeading">
                    <div>
                      <div className="eyebrow">FIELD INTELLIGENCE · ESTIMATE</div>
                      <h2>Venezuela drilling outlook</h2>
                    </div>
                    <span className="badge">MARKET INTEL</span>
                  </div>
                  <p className="sectionIntro">Estimaciones de inteligencia de mercado confirmadas en terreno y utilizadas para planeación comercial. No se presentan como rig count público certificado.</p>
                  <div className="intelligenceGrid">
                    {intelligence.map((item, index) => (
                      <article className="intelCard" key={`${item.label}-${index}`}>
                        <span>{item.label}</span>
                        <strong>{item.value}</strong>
                        {item.note && <p>{item.note}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              <section className="reviewSection accessPolicy" id="access-policy">
                <h2>Access policy</h2>
                <p>PREVIEW habilita únicamente representaciones derivadas. RELEASED identifica entregables liberados. SOURCE_RELEASED, junto con un grant explícito de descarga, es el único estado que permite entregar el archivo fuente.</p>
                <p className="meta">No export · no print · no source file endpoint in PREVIEW.</p>
                {canDownloadSource && <a className="button" href={`/api/documents/${id}/download`}>Descargar fuente liberada</a>}
              </section>
            </div>
          </section>
        </PreviewGuard>
      </div>
    </main>
  );
}
