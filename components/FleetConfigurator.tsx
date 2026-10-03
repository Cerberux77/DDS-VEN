
"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACQUISITION_OPTIONS,
  CUSTOMS_MODE_OPTIONS,
  CUSTOMS_VALUE_FACTOR_OPTIONS,
  DSO_OPTIONS,
  FRONT_CONFIGURATION_OPTIONS,
  GUARANTEE_MODE_OPTIONS,
  HYDROCARBON_BENEFIT_OPTIONS,
  OPTIONAL_475_OPTIONS,
  SURETY_RATE_OPTIONS,
  TECHNICAL_OPTIONS,
  type FleetScenario,
  type ScenarioSelection,
} from "@/lib/dds/scenario-types";

type ViewKey = "overview" | "fleet" | "assets" | "funding" | "assumptions";

const VIEWS: Array<{ key: ViewKey; label: string }> = [
  { key: "overview", label: "Executive Overview" },
  { key: "fleet", label: "Fleet Configuration" },
  { key: "assets", label: "Asset / BHA Drilldown" },
  { key: "funding", label: "Funding & Economics" },
  { key: "assumptions", label: "Assumptions / Source Status" },
];

function money(value: number | null) {
  if (value === null) return "PENDING";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function pct(value: number | "CUSTOM") {
  return value === "CUSTOM" ? "CUSTOM" : Math.round(value * 100) + "%";
}

function sourceClass(label: string) {
  if (label.includes("AFE")) return "sourceBadge sourceAfe";
  if (label.includes("MODEL")) return "sourceBadge sourceModel";
  if (label.includes("PENDING")) return "sourceBadge sourcePending";
  return "sourceBadge";
}

function Metric({ label, value, note }: { label: string; value: number | null; note: string }) {
  return (
    <article className="fleetMetric">
      <span>{label}</span>
      <strong>{money(value)}</strong>
      <small>{note}</small>
    </article>
  );
}

function selectorLabel(value: string) {
  return value.replaceAll("_", " ");
}

export function FleetConfigurator({ initialScenario }: { initialScenario: FleetScenario }) {
  const [scenario, setScenario] = useState(initialScenario);
  const [selection, setSelection] = useState<ScenarioSelection>(initialScenario.selection);
  const [activeView, setActiveView] = useState<ViewKey>("overview");
  const [selectedAssetId, setSelectedAssetId] = useState(initialScenario.physical.assetFamilies[0]?.assetId ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedAsset = useMemo(
    () => scenario.physical.assetFamilies.find((asset) => asset.assetId === selectedAssetId) ?? scenario.physical.assetFamilies[0] ?? null,
    [scenario.physical.assetFamilies, selectedAssetId]
  );

  useEffect(() => {
    if (JSON.stringify(selection) === JSON.stringify(scenario.selection)) return;

    const controller = new AbortController();
    setLoading(true);
    setError("");

    fetch("/api/dds/scenario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selection),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("SCENARIO_REQUEST_FAILED");
        return response.json() as Promise<FleetScenario>;
      })
      .then((next) => {
        setScenario(next);
        setSelectedAssetId(next.physical.assetFamilies[0]?.assetId ?? "");
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError("No se pudo resolver el escenario. Se mantiene la última configuración válida.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selection, scenario.selection]);

  function update<K extends keyof ScenarioSelection>(key: K, value: ScenarioSelection[K]) {
    setSelection((current) => ({ ...current, [key]: value }));
  }

  const resolved = scenario.economics.status === "RESOLVED";
  const assetRegisterIsAnchor =
    scenario.selection.frontConfiguration !== "STATIC_2F" ||
    scenario.selection.technical !== "EWERT_LEAN";

  return (
    <>
      <section className="rev1SelectorShell" aria-label="S04 Rev1 scenario selectors">
        <div className="selectorPrimary">
          <label>
            <span>Front Configuration</span>
            <select value={selection.frontConfiguration} onChange={(e) => update("frontConfiguration", e.target.value as ScenarioSelection["frontConfiguration"])}>
              {FRONT_CONFIGURATION_OPTIONS.map((value) => <option key={value} value={value}>{selectorLabel(value)}</option>)}
            </select>
          </label>
          <label>
            <span>Technical</span>
            <select value={selection.technical} onChange={(e) => update("technical", e.target.value as ScenarioSelection["technical"])}>
              {TECHNICAL_OPTIONS.map((value) => <option key={value} value={value}>{selectorLabel(value)}</option>)}
            </select>
          </label>
          <label>
            <span>Acquisition</span>
            <select value={selection.acquisition} onChange={(e) => update("acquisition", e.target.value as ScenarioSelection["acquisition"])}>
              {ACQUISITION_OPTIONS.map((value) => <option key={value} value={value}>{selectorLabel(value)}</option>)}
            </select>
          </label>
          <label>
            <span>DSO</span>
            <select value={selection.dso} onChange={(e) => update("dso", Number(e.target.value) as ScenarioSelection["dso"])}>
              {DSO_OPTIONS.map((value) => <option key={value} value={value}>{value} days</option>)}
            </select>
          </label>
        </div>

        <details className="advancedSelectors">
          <summary>Customs / Surety / Optional controls</summary>
          <div className="selectorAdvancedGrid">
            <label>
              <span>Customs Mode</span>
              <select value={selection.customsMode} onChange={(e) => update("customsMode", e.target.value as ScenarioSelection["customsMode"])}>
                {CUSTOMS_MODE_OPTIONS.map((value) => <option key={value} value={value}>{selectorLabel(value)}</option>)}
              </select>
            </label>
            <label>
              <span>Customs Value</span>
              <select
                value={String(selection.customsValueFactor)}
                onChange={(e) => update("customsValueFactor", e.target.value === "CUSTOM" ? "CUSTOM" : Number(e.target.value) as ScenarioSelection["customsValueFactor"])}
              >
                {CUSTOMS_VALUE_FACTOR_OPTIONS.map((value) => <option key={String(value)} value={String(value)}>{typeof value === "number" ? pct(value) : value}</option>)}
              </select>
            </label>
            <label>
              <span>Surety</span>
              <select
                value={String(selection.suretyRate)}
                onChange={(e) => update("suretyRate", e.target.value === "CUSTOM" ? "CUSTOM" : Number(e.target.value) as ScenarioSelection["suretyRate"])}
              >
                {SURETY_RATE_OPTIONS.map((value) => <option key={String(value)} value={String(value)}>{typeof value === "number" ? pct(value) : value}</option>)}
              </select>
            </label>
            <label>
              <span>Guarantee</span>
              <select value={selection.guaranteeMode} onChange={(e) => update("guaranteeMode", e.target.value as ScenarioSelection["guaranteeMode"])}>
                {GUARANTEE_MODE_OPTIONS.map((value) => <option key={value} value={value}>{selectorLabel(value)}</option>)}
              </select>
            </label>
            <label>
              <span>Hydrocarbon Benefit</span>
              <select value={selection.hydrocarbonBenefit} onChange={(e) => update("hydrocarbonBenefit", e.target.value as ScenarioSelection["hydrocarbonBenefit"])}>
                {HYDROCARBON_BENEFIT_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            <label>
              <span>Optional 4¾</span>
              <select value={selection.optional475} onChange={(e) => update("optional475", e.target.value as ScenarioSelection["optional475"])}>
                {OPTIONAL_475_OPTIONS.map((value) => <option key={value} value={value}>{value}</option>)}
              </select>
            </label>
            {selection.technical !== "EWERT_LEAN" && (
              <label>
                <span>Future Physical Front Count</span>
                <select value={selection.futureTechnicalFrontCount} onChange={(e) => update("futureTechnicalFrontCount", Number(e.target.value))}>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => <option key={value} value={value}>{value}</option>)}
                </select>
              </label>
            )}
            <div className="selectorReadOnly">
              <span>Austral Contribution</span>
              <strong>USD 0 confirmed</strong>
              <small>asset-level · current evidence</small>
            </div>
          </div>
        </details>

        <div className="scenarioStrip">
          <div><span>Scenario</span><strong>{scenario.scenarioLabel}</strong></div>
          <div><span>Technical</span><strong>{selectorLabel(selection.technical)}</strong></div>
          <div><span>Acquisition</span><strong>{selectorLabel(selection.acquisition)}</strong></div>
          <div><span>DSO</span><strong>{selection.dso} days</strong></div>
          <div><span>Source</span><strong className={sourceClass(scenario.sourceBadge)}>{scenario.sourceBadge}</strong></div>
          <div><span>Resolver</span><strong>{loading ? "UPDATING…" : resolved ? "RECONCILED" : scenario.economics.status}</strong></div>
        </div>
      </section>

      {error && <div className="error fleetError">{error}</div>}

      <nav className="rev1ViewNav" aria-label="Configurator views">
        {VIEWS.map((view) => (
          <button key={view.key} type="button" className={activeView === view.key ? "active" : ""} onClick={() => setActiveView(view.key)}>
            {view.label}
          </button>
        ))}
      </nav>

      {activeView === "overview" && (
        <section className="rev1View">
          <div className="sectionHeading">
            <div><div className="eyebrow">SELECTED SCENARIO</div><h2>Executive Overview</h2></div>
            <span className={sourceClass(scenario.sourceBadge)}>{scenario.sourceBadge}</span>
          </div>

          {!resolved && (
            <div className="pendingPanel">
              <strong>{scenario.economics.sourceStatus}</strong>
              <p>{scenario.economics.note}</p>
              {selection.optional475 === "YES" && <p>Known optional CAPEX: <strong>{money(scenario.economics.optional475KnownCapex)}</strong> before unresolved incremental logistics/customs.</p>}
            </div>
          )}

          <div className="headlineKpis">
            <Metric label="Equipment CAPEX" value={scenario.economics.equipmentCapex} note={scenario.economics.sourceStatus} />
            <Metric label="Pre-op / Startup Cash" value={scenario.economics.preopCash} note="scenario cash before operations" />
            <Metric label="Gross Peak Funding" value={scenario.economics.grossPeakFunding} note="NOT required equity" />
            <Metric label="Target Funding Capacity" value={scenario.economics.targetFundingCapacity} note="peak + liquidity floor" />
            <Metric label="Peak AR" value={scenario.economics.peakAR} note={"DSO " + selection.dso} />
            <Metric label="24M EBITDA" value={scenario.economics.ebitda24M} note="selected scenario only" />
            <Metric label="24M Net Income" value={scenario.economics.netIncome24M} note="selected scenario only" />
            <Metric label="24M FCF" value={scenario.economics.fcf24M} note="selected scenario only" />
          </div>

          <article className="benchmarkCard">
            <div>
              <div className="eyebrow">SUPPLIER-BACKED ANCHOR</div>
              <h3>2F STARTUP — EWERT AFE REV0</h3>
              <p>This benchmark remains visible even when the internal S04 default is Ramp 3→10. Presentation emphasis does not change the engine default.</p>
            </div>
            <div className="benchmarkNumbers">
              <div><span>Equipment AFE</span><strong>{money(scenario.benchmark2F.equipmentCapex)}</strong></div>
              <div><span>Purchase Startup P50</span><strong>{money(scenario.benchmark2F.purchaseStartupP50)}</strong></div>
              <div><span>Pre-op Cash</span><strong>{money(scenario.benchmark2F.preopCash)}</strong></div>
              <div><span>Gross Peak · DSO {selection.dso}</span><strong>{money(scenario.benchmark2F.grossPeakFunding)}</strong></div>
            </div>
            <span className="sourceBadge sourceAfe">AFE BACKED</span>
          </article>

          {selection.frontConfiguration === "RAMP_3_TO_10" && (
            <div className="rampMilestones">
              {scenario.physical.rampMilestones.map((point) => (
                <div key={point.month}><span>M{point.month}</span><strong>{point.fronts}F</strong></div>
              ))}
            </div>
          )}
        </section>
      )}

      {activeView === "fleet" && (
        <section className="rev1View">
          <div className="sectionHeading">
            <div><div className="eyebrow">PHYSICAL ARCHITECTURE</div><h2>Fleet Configuration</h2></div>
            <span className={sourceClass(scenario.physical.sourceStatus)}>{scenario.physical.sourceStatus.replace("_", " ")}</span>
          </div>
          <p className="sectionIntro">{scenario.physical.note}</p>

          {scenario.physical.conceptualSummary ? (
            <div className="conceptualGrid">
              <div><span>Fronts</span><strong>{scenario.physical.conceptualSummary.fronts}</strong></div>
              <div><span>Main / diameter</span><strong>{scenario.physical.conceptualSummary.mainPerDiameter}</strong></div>
              <div><span>Backup / diameter</span><strong>{scenario.physical.conceptualSummary.backupPerDiameter}</strong></div>
              <div><span>Total physical BHA positions</span><strong>{scenario.physical.conceptualSummary.totalPhysicalBhaPositions}</strong></div>
            </div>
          ) : scenario.physical.fronts.length > 0 ? (
            <div className="rev1FrontGrid">
              {scenario.physical.fronts.map((front) => (
                <article className="rev1FrontCard" key={front.front}>
                  <div className="frontTitle"><span>FRONT</span><strong>{String(front.front).padStart(2, "0")}</strong></div>
                  {front.families.map((family) => (
                    <div className="holeFamily" key={family.holeFamily}>
                      <h3>{family.holeFamily} family</h3>
                      <ul>{family.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      <p>{family.operatingNote}</p>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          ) : (
            <div className="rampManagement">
              <h3>Ramp capacity path</h3>
              <div className="rampMilestones">
                {scenario.physical.rampMilestones.map((point) => (
                  <div key={point.month}><span>M{point.month}</span><strong>{point.fronts}F</strong><small>MODEL DERIVED</small></div>
                ))}
              </div>
              <p>Detailed line-item asset quantities beyond the 2F AFE anchor are not represented as supplier-quoted assets.</p>
            </div>
          )}

          {scenario.physical.pools.length > 0 && (
            <>
              <div className="eyebrow poolEyebrow">SHARED BACKUP / ROTATION POOLS</div>
              <div className="poolGrid">
                {scenario.physical.pools.map((pool) => (
                  <article key={pool.title}><h3>{pool.title}</h3><ul>{pool.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
                ))}
              </div>
            </>
          )}
        </section>
      )}

      {activeView === "assets" && (
        <section className="rev1View">
          <div className="sectionHeading">
            <div>
              <div className="eyebrow">AFE ASSET REGISTER</div>
              <h2>Asset / BHA Drilldown</h2>
              {assetRegisterIsAnchor && <p className="meta">Detailed cards below are the 2F EWERT AFE-backed anchor; selected higher-capacity scenario is model-derived.</p>}
            </div>
            <span className="sourceBadge sourceAfe">AFE BACKED 2F</span>
          </div>

          <div className="assetDrilldownLayout">
            <div className="assetFamilyList">
              {scenario.physical.assetFamilies.map((asset) => (
                <button key={asset.assetId} type="button" className={selectedAsset?.assetId === asset.assetId ? "active" : ""} onClick={() => setSelectedAssetId(asset.assetId)}>
                  <span>{asset.family}</span>
                  <strong>{asset.description}</strong>
                  <small>{asset.holeFamily}</small>
                </button>
              ))}
            </div>

            <aside className="assetInspector rev1Inspector">
              {selectedAsset ? (
                <>
                  <div className="assetInspectorHeader">
                    <div><div className="eyebrow">{selectedAsset.family}</div><h2>{selectedAsset.assetId}</h2></div>
                    <span className={selectedAsset.requiredOrOptional === "OPTIONAL" ? "sourceBadge sourceOptional" : "sourceBadge sourceAfe"}>{selectedAsset.requiredOrOptional}</span>
                  </div>
                  <h3>{selectedAsset.description}</h3>
                  <dl className="assetFacts">
                    <div><dt>OD / hole family</dt><dd>{selectedAsset.holeFamily}</dd></div>
                    <div><dt>Commercial quantity</dt><dd>{selectedAsset.commercialQuantity} {selectedAsset.commercialUnit}</dd></div>
                    <div><dt>Physical quantity</dt><dd>{selectedAsset.physicalQuantity ?? "N/A / pooled"}</dd></div>
                    <div><dt>Main</dt><dd>{selectedAsset.mainQuantity ?? "Not frozen"}</dd></div>
                    <div><dt>Backup</dt><dd>{selectedAsset.backupQuantity ?? "Not frozen"}</dd></div>
                    <div><dt>Rotation</dt><dd>{selectedAsset.rotationQuantity ?? "Not frozen"}</dd></div>
                    <div><dt>Shared</dt><dd>{selectedAsset.sharedQuantity ?? "Not frozen"}</dd></div>
                    <div><dt>Purchase value</dt><dd>{money(selectedAsset.purchaseValue)}</dd></div>
                    <div><dt>Temporary admission</dt><dd>{selectedAsset.temporaryAdmissionCandidate ? "CANDIDATE" : "NO"}</dd></div>
                    <div><dt>Lease status</dt><dd>{selectedAsset.leaseStatus}</dd></div>
                    <div><dt>Front assignment</dt><dd>{selectedAsset.frontAssignment}</dd></div>
                    <div><dt>Source</dt><dd>{selectedAsset.sourceStatus}</dd></div>
                  </dl>
                  {selectedAsset.notes.length > 0 && <ul className="reviewList">{selectedAsset.notes.map((note) => <li key={note}>{note}</li>)}</ul>}
                </>
              ) : <p>No AFE-backed asset family is available for this conceptual view.</p>}
            </aside>
          </div>
        </section>
      )}

      {activeView === "funding" && (
        <section className="rev1View">
          <div className="sectionHeading">
            <div><div className="eyebrow">S04 ECONOMIC AUTHORITY</div><h2>Funding & Economics</h2></div>
            <span className={sourceClass(scenario.economics.sourceStatus)}>{scenario.economics.sourceStatus}</span>
          </div>

          <div className="fundingGrid">
            <Metric label="Equipment" value={scenario.economics.equipmentCapex} note="scenario CAPEX" />
            <Metric label="Logistics" value={scenario.economics.logistics} note="S04 handoff" />
            <Metric label="Surety" value={scenario.economics.surety} note="separate from suspended taxes" />
            <Metric label="Pre-op Cash" value={scenario.economics.preopCash} note="pre-operation cash requirement" />
            <Metric label="M0–M4 Cash" value={scenario.economics.m0M4CashRequirement} note="management timing assumption" />
            <Metric label="Year 1 Funding" value={scenario.economics.year1Funding} note="selected scenario" />
            <Metric label="Gross Peak Funding" value={scenario.economics.grossPeakFunding} note="not required equity" />
            <Metric label="Liquidity Floor" value={scenario.economics.liquidityFloor} note="S03/S04 preserved floor" />
            <Metric label="Target Funding Capacity" value={scenario.economics.targetFundingCapacity} note="S04 output" />
          </div>

          <div className="grossNetBridge">
            <div><span>Gross Peak Funding</span><strong>{money(scenario.economics.grossPeakFunding)}</strong></div>
            <div className="bridgeOperator">−</div>
            <div><span>Confirmed Austral Asset Contribution</span><strong>{money(scenario.economics.confirmedAustralContribution)}</strong><small>0 confirmed by current evidence</small></div>
            <div className="bridgeOperator">=</div>
            <div><span>Net Peak Funding</span><strong>{money(scenario.economics.netPeakFunding)}</strong><small>not required equity</small></div>
          </div>

          {scenario.fundingBridge.length > 0 ? (
            <div className="fundingBridgeTable">
              <div className="eyebrow">DEFAULT RAMP DSO90 RECONCILIATION</div>
              {scenario.fundingBridge.map((item) => (
                <div className="fundingBridgeRow" key={item.order}>
                  <span>{item.component}</span>
                  <strong>{money(item.amount)}</strong>
                  <small>{item.treatment}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="emptyState">
              <strong>Detailed funding bridge not emitted for this selector combination.</strong>
              <p>S05 does not reconstruct the S04 residual bridge. Peak Funding and other resolved headline outputs remain authoritative when available.</p>
            </div>
          )}
        </section>
      )}

      {activeView === "assumptions" && (
        <section className="rev1View">
          <div className="sectionHeading">
            <div><div className="eyebrow">PROVENANCE / OPEN GATES</div><h2>Assumptions / Source Status</h2></div>
            <span className={"statusPill " + (scenario.reconciliation.computationalUiReconciliation === "PASS" ? "previewPill" : "restrictedPill")}>
              UI RECONCILIATION {scenario.reconciliation.computationalUiReconciliation}
            </span>
          </div>
          <div className="assumptionGrid">
            {scenario.assumptions.map((item) => (
              <article key={item.label}><span>{item.label}</span><strong>{item.value}</strong><p>{item.status}</p></article>
            ))}
          </div>
          <div className="reconciliationPanel rev1Reconciliation">
            <h3>Reconciliation controls</h3>
            <div className="reconciliationGrid">
              <div><span>Economics authority</span><strong>{scenario.reconciliation.economicsSource}</strong></div>
              <div><span>Physical authority</span><strong>{scenario.reconciliation.physicalSource}</strong></div>
              <div><span>No KIT double count</span><strong>{scenario.reconciliation.noKitDoubleCount ? "PASS" : "FAIL"}</strong></div>
              <div><span>LIH basis</span><strong>{scenario.reconciliation.lihBasis}</strong></div>
              <div><span>Gross funding ≠ equity</span><strong>{scenario.reconciliation.grossFundingNotEquity ? "PASS" : "FAIL"}</strong></div>
              <div><span>Austral credit wording</span><strong>{scenario.reconciliation.australCreditLabelSafe ? "PASS" : "FAIL"}</strong></div>
            </div>
            <p className="meta">{scenario.reconciliation.note}</p>
          </div>
        </section>
      )}
    </>
  );
}
