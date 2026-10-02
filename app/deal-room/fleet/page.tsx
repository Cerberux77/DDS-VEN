import Link from "next/link";
import { requireSession } from "@/lib/session";
import { buildFleetScenario } from "@/lib/dds/scenario-engine";
import { FleetConfigurator } from "@/components/FleetConfigurator";

export default async function FleetPage() {
  const session = await requireSession();
  const initialScenario = buildFleetScenario({
    fronts: 3,
    technical: "OPTIMIZED",
    acquisition: "PURCHASE",
  });

  return (
    <main className="shell fleetPage">
      <nav className="toolbar" aria-label="Navegación de Deal Room">
        <Link className="ghostButton" href="/deal-room">← Deal Room</Link>
        <div className="breadcrumbs">
          <Link href="/deal-room">Deal Room</Link><span>/</span><strong>Fleet Configurator</strong>
        </div>
      </nav>

      <section className="hero fleetHero">
        <div className="eyebrow">DDS VENEZUELA · CONTROLLED DERIVED VIEW · {session.email}</div>
        <h1>Visual Fleet Configurator</h1>
        <p>Configuración física y económica derivada del motor canónico S01–S04. Las reglas se ejecutan en servidor; el navegador recibe únicamente el resultado del escenario.</p>
        <div className="notice">
          <strong>S05 source boundary.</strong> No se replica un segundo modelo financiero en HTML. Los valores económicos que dependen del AFE S02 o del modelo reconciliado S03 permanecen identificados como pendientes.
        </div>
      </section>

      <FleetConfigurator initialScenario={initialScenario} />
    </main>
  );
}
