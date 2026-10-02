"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ACQUISITION_OPTIONS,
  FRONT_OPTIONS,
  TECHNICAL_OPTIONS,
  type FleetAsset,
  type FleetScenario,
  type ScenarioSelection,
} from "@/lib/dds/scenario-types";

function money(value: number | null) {
  if (value === null) return "Pending";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function metricValue(value: number | null, state?: string) {
  if (value === null) return state === "PENDING_S03" ? "Pending S03" : "Pending AFE";
  return money(value);
}

function holdingLabel(asset: FleetAsset) {
  if (asset.acquisitionState === "UNASSIGNED") return "TBD";
  return asset.acquisitionState;
}

function AssetButton({ asset, onOpen }: { asset: FleetAsset; onOpen: (asset: FleetAsset) => void }) {
  return (
    <button className="fleetAsset" type="button" onClick={() => onOpen(asset)}>
      <span className="fleetAssetTop">
        <strong>{asset.diameter} · {asset.role}</strong>
        <span className={`statusPill ${asset.acquisitionState === "OWNED" ? "previewPill" : "restrictedPill"}`}>
          {holdingLabel(asset)}
        </span>
      </span>
      <span className="fleetAssetId">{asset.assetId}</span>
      <span className="fleetAssetAssignment">{asset.assignment}</span>
    </button>
  );
}

export function FleetConfigurator({ initialScenario }: { initialScenario: FleetScenario }) {
  const [scenario, setScenario] = useState(initialScenario);
  const [selection, setSelection] = useState<ScenarioSelection>(initialScenario.selection);
  const [selectedAsset, setSelectedAsset] = useState<FleetAsset | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      selection.fronts === scenario.selection.fronts &&
      selection.technical === scenario.selection.technical &&
      selection.acquisition === scenario.selection.acquisition
    ) return;

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
        setSelectedAsset(null);
      })
      .catch((requestError: unknown) => {
        if (requestError instanceof DOMException && requestError.name === "AbortError") return;
        setError("No se pudo recalcular el escenario. Se mantiene la última configuración válida.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [selection, scenario.selection]);

  const fronts = useMemo(
    () => Array.from({ length: scenario.selection.fronts }, (_, index) => index + 1),
    [scenario.selection.fronts]
  );

  const mainAssets = scenario.assets.filter((asset) => asset.role === "MAIN");
  const backupAssets = scenario.assets.filter((asset) => asset.role === "BACKUP");

  return (
    <>
      <section className="fleetControls" aria-label="Scenario selectors">
        <label>
          <span>Fronts</span>
          <select
            value={selection.fronts}
            onChange={(event) => setSelection((current) => ({ ...current, fronts: Number(event.target.value) as ScenarioSelection["fronts"] }))}
          >
            {FRONT_OPTIONS.map((front) => <option key={front} value={front}>{front}</option>)}
          </select>
        </label>
        <label>
          <span>Technical</span>
          <select
            value={selection.technical}
            onChange={(event) => setSelection((current) => ({ ...current, technical: event.target.value as ScenarioSelection["technical"] }))}
          >
            {TECHNICAL_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </label>
        <label>
          <span>Acquisition</span>
          <select
            value={selection.acquisition}
            onChange={(event) => setSelection((current) => ({ ...current, acquisition: event.target.value as ScenarioSelection["acquisition"] }))}
          >
            {ACQUISITION_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option === "PURCHASE" ? "PURCHASE" : option === "HYBRID_LEASE_18M" ? "HYBRID 18M" : "HYBRID 24M"}
              </option>
            ))}
          </select>
        </label>
        <div className="scenarioIdentity">
          <span>Scenario</span>
          <strong>{scenario.scenarioKey}</strong>
          <small>{loading ? "Recalculating…" : "Server-derived"}</small>
        </div>
      </section>

      {error && <div className="error fleetError">{error}</div>}

      <section className="fleetMetricGrid" aria-label="Fleet and financial metrics">
        <article><span>Total Sets</span><strong>{scenario.financials.totalSets}</strong><small>physical requirement</small></article>
        <article><span>Owned Sets</span><strong>{scenario.financials.ownedSets ?? "TBD"}</strong><small>{scenario.selection.acquisition === "PURCHASE" ? "scenario allocation" : "pending S02"}</small></article>
        <article><span>Leased Sets</span><strong>{scenario.financials.leasedSets ?? "TBD"}</strong><small>{scenario.financials.leaseTermMonths ? `${scenario.financials.leaseTermMonths}M term` : "none"}</small></article>
        <article><span>Equipment CAPEX</span><strong>{metricValue(scenario.financials.equipmentCapex.value, scenario.financials.equipmentCapex.state)}</strong><small>{scenario.financials.equipmentCapex.state}</small></article>
        <article><span>Upfront Cash</span><strong>{metricValue(scenario.financials.upfrontCash.value, scenario.financials.upfrontCash.state)}</strong><small>{scenario.financials.upfrontCash.state}</small></article>
        <article><span>Peak Funding</span><strong>{metricValue(scenario.financials.peakFunding.value, scenario.financials.peakFunding.state)}</strong><small>{scenario.financials.peakFunding.state}</small></article>
        <article><span>Lease Cost</span><strong>{metricValue(scenario.financials.leaseCost.value, scenario.financials.leaseCost.state)}</strong><small>{scenario.financials.costOfCapitalPct ? `${scenario.financials.costOfCapitalPct}% CoC · basis pending` : "PURCHASE"}</small></article>
        <article><span>24M Financial Impact</span><strong>{metricValue(scenario.financials.financialImpact24M.value, scenario.financials.financialImpact24M.state)}</strong><small>{scenario.financials.financialImpact24M.state}</small></article>
      </section>

      <div className="fleetWorkspace">
        <div>
          <section className="fleetSection">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">ACTIVE FRONTS</div>
                <h2>Main BHA allocation</h2>
              </div>
              <span className="badge">{scenario.counts.mainPerDiameter} MAIN / diameter</span>
            </div>

            <div className="frontGrid">
              {fronts.map((front) => {
                const assigned = mainAssets.filter((asset) => asset.coversFronts.includes(front));
                return (
                  <article className="frontCard" key={front}>
                    <div className="frontTitle">
                      <span>FRONT</span>
                      <strong>{String(front).padStart(2, "0")}</strong>
                    </div>
                    <div className="frontAssets">
                      {assigned.map((asset) => <AssetButton key={asset.assetId} asset={asset} onOpen={setSelectedAsset} />)}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="fleetSection">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">REDUNDANCY</div>
                <h2>Backup pool</h2>
              </div>
              <span className="badge">{scenario.counts.backupPerDiameter} BACKUP / diameter</span>
            </div>
            <div className="backupColumns">
              {(['12 1/4"', '8 1/2"'] as const).map((diameter) => (
                <article className="backupColumn" key={diameter}>
                  <h3>{diameter}</h3>
                  <div className="backupList">
                    {backupAssets.filter((asset) => asset.diameter === diameter).map((asset) => (
                      <div className="backupRow" key={asset.assetId}>
                        <AssetButton asset={asset} onOpen={setSelectedAsset} />
                        <div className="coverage">
                          <span>COVERS</span>
                          <strong>{asset.coversFronts.map((front) => `F${String(front).padStart(2, "0")}`).join(" · ")}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="fleetSection reconciliationPanel">
            <div className="sectionHeading">
              <div>
                <div className="eyebrow">QA / RECONCILIATION</div>
                <h2>Scenario engine controls</h2>
              </div>
              <span className={`statusPill ${scenario.reconciliation.setCountMatches && scenario.reconciliation.backupCoverageValid ? "previewPill" : "restrictedPill"}`}>
                PHYSICAL {scenario.reconciliation.setCountMatches && scenario.reconciliation.backupCoverageValid ? "PASS" : "FAIL"}
              </span>
            </div>
            <div className="reconciliationGrid">
              <div><span>Required = allocated</span><strong>{scenario.reconciliation.requiredSets} = {scenario.reconciliation.allocatedAssets}</strong></div>
              <div><span>Backup coverage</span><strong>{scenario.reconciliation.backupCoverageValid ? "PASS" : "FAIL"}</strong></div>
              <div><span>Acquisition balance</span><strong>{scenario.reconciliation.acquisitionBalanceValid === null ? "PENDING S02" : scenario.reconciliation.acquisitionBalanceValid ? "PASS" : "FAIL"}</strong></div>
              <div><span>Economics</span><strong>{scenario.reconciliation.economicsReconciled ? "PASS" : "PENDING S02/S03"}</strong></div>
            </div>
            <p className="meta">{scenario.reconciliation.note}</p>
          </section>

          <section className="fleetSection assumptionsPanel">
            <div className="eyebrow">CANONICAL / OPEN ITEMS</div>
            <h2>Assumptions visible by design</h2>
            <ul className="reviewList">{scenario.assumptions.map((item) => <li key={item}>{item}</li>)}</ul>
          </section>
        </div>

        <aside className="assetInspector" aria-live="polite">
          {selectedAsset ? (
            <>
              <div className="assetInspectorHeader">
                <div>
                  <div className="eyebrow">ASSET COMPOSITION</div>
                  <h2>{selectedAsset.assetId}</h2>
                </div>
                <button className="ghostButton" type="button" onClick={() => setSelectedAsset(null)}>Close</button>
              </div>
              <dl className="assetFacts">
                <div><dt>Diameter</dt><dd>{selectedAsset.diameter}</dd></div>
                <div><dt>Role</dt><dd>{selectedAsset.role}</dd></div>
                <div><dt>Assignment</dt><dd>{selectedAsset.assignment}</dd></div>
                <div><dt>Covers</dt><dd>{selectedAsset.coversFronts.map((front) => `F${String(front).padStart(2, "0")}`).join(", ")}</dd></div>
                <div><dt>Owner</dt><dd>{selectedAsset.owner}</dd></div>
                <div><dt>Owned / leased</dt><dd>{holdingLabel(selectedAsset)}</dd></div>
                <div><dt>CAPEX / value</dt><dd>{selectedAsset.capexValue === null ? "Pending AFE" : money(selectedAsset.capexValue)}</dd></div>
                <div><dt>Lease state</dt><dd>{selectedAsset.leaseState}</dd></div>
                <div><dt>Status</dt><dd>{selectedAsset.status}</dd></div>
                <div><dt>Location</dt><dd>{selectedAsset.location}</dd></div>
                <div><dt>Availability</dt><dd>{selectedAsset.availability}</dd></div>
              </dl>
              <h3>BHA / support composition</h3>
              <div className="componentList">
                {selectedAsset.composition.map((component) => (
                  <div className="componentRow" key={component.name}>
                    <div><strong>{component.name}</strong><span>{component.relationship}</span></div>
                    <span className={`statusPill ${component.status === "DEFINED" ? "previewPill" : "restrictedPill"}`}>{component.status}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="inspectorEmpty">
              <div className="eyebrow">ASSET DETAIL</div>
              <h2>Select any set/BHA</h2>
              <p>Open a MAIN or BACKUP asset to inspect composition, coverage, holding state, value status and support relationships.</p>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}
