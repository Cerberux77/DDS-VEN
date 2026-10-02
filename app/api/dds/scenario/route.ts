import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/session";
import { buildFleetScenario, parseScenarioSelection } from "@/lib/dds/scenario-engine";

export async function POST(request: Request) {
  const session = await getSessionContext();
  if (!session) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  if (!session.termsAccepted) return NextResponse.json({ error: "TERMS_REQUIRED" }, { status: 403 });

  try {
    const selection = parseScenarioSelection(await request.json());
    const scenario = buildFleetScenario(selection);
    return NextResponse.json(scenario, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "INVALID_SCENARIO_SELECTION" }, { status: 400 });
  }
}
