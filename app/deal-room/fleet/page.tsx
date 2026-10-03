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
          <Link href="/deal-room">Deal Room</Link><span>/</span><strong>Fleet Configurator Rev2</strong>
        </div>
      </nav>

      <section className="hero fleetHero">
        <div className="eyebrow">DDS VENEZUELA · 3F-CAPABLE / PARTNER-CONTRIBUTION / LIQUIDITY-DRIVEN · {session.email}</div>
        <h1>DDS Visual Fleet Configurator Rev2</h1>
        <p>Presentation and interaction layer over the Ewert 3 Jobs AFE, partner contribution structure and the S04 Rev2 server-side liquidity engine.</p>
        <div className="notice">
          <strong>Single canonical server engine.</strong> The browser only renders S04 Rev2 results. The base case is 3F-capable / 2F-active, with Ewert/Austral in-kind tools and Panthers cash focused on PR2 8¼, infrastructure, workshop, office/IT, vehicles, import and working capital.
        </div>
      </section>

      <FleetConfigurator initialScenario={initialScenario} />
    </main>
  );
}
