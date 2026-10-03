import Link from "next/link";
import { requireSession } from "@/lib/session";
import { buildFleetScenario, defaultScenarioSelection } from "@/lib/dds/scenario-engine";
import { FleetConfigurator } from "@/components/FleetConfigurator";

export default async function FleetPage() {
  const session = await requireSession();
  const initialScenario = buildFleetScenario(defaultScenarioSelection());

  return (
    <main className="shell fleetPage">
      <nav className="toolbar" aria-label="Navegación de Deal Room">
        <Link className="ghostButton" href="/deal-room">← Deal Room</Link>
        <div className="breadcrumbs">
          <Link href="/deal-room">Deal Room</Link><span>/</span><strong>Fleet Configurator Rev1</strong>
        </div>
      </nav>

      <section className="hero fleetHero">
        <div className="eyebrow">DDS VENEZUELA · AFE-BACKED / SCENARIO-DRIVEN · {session.email}</div>
        <h1>DDS Visual Fleet Configurator Rev1</h1>
        <p>Presentation and interaction layer over the S01/S02 physical architecture and the S04 Rev1 machine-readable scenario handoff.</p>
        <div className="notice">
          <strong>No second economic engine.</strong> Headline economics are exact S04 handoff snapshots. Unresolved selector combinations are shown as pending rather than recalculated in S05.
        </div>
      </section>

      <FleetConfigurator initialScenario={initialScenario} />
    </main>
  );
}
