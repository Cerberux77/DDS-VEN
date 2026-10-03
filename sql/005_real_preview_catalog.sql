-- DDS-VEN QA preview catalog enrichment.
-- Derived preview metadata only. No Drive URLs, source bytes, credentials or editable formulas
-- are exposed to the browser by this migration.

update document_versions dv
set preview_payload = '{
  "heading": "Fase 1 · Resumen ejecutivo",
  "summary": "Representación derivada de entregables reales de Fase 1 y material ejecutivo asociado. Los archivos fuente permanecen en Drive y no se entregan al navegador.",
  "items": [
    "Mandato de decisión y criterios de entrada definidos",
    "Mapa de decisión, inventario de información y premisas trazables",
    "Arquitectura del modelo y plan de investigación establecidos",
    "Cinco casos cliente-campo definidos para análisis",
    "Frontera explícita entre cierre de Fase 1 y recomendación final de inversión"
  ],
  "materials": [
    {
      "title": "DDS_Entrada_Venezuela_Memoria_Ejecutiva_v2.0_2026-08-30.pdf",
      "type": "Memoria ejecutiva · Drive source registered",
      "status": "PREVIEW",
      "description": "Memoria ejecutiva de entrada a Venezuela utilizada como antecedente del mandato."
    },
    {
      "title": "DDS_Resumen_Ejecutivo_AC_BLIND_v6.pdf",
      "type": "Executive review · Drive source registered",
      "status": "PREVIEW",
      "description": "Presentación ejecutiva histórica del caso DDS; se mantiene como evidencia y no sustituye el rebase Rev1."
    },
    {
      "title": "05_Presentacion_Kickoff_Fase_1_DDS_2026-09-17.pdf",
      "type": "Kickoff · Drive source registered",
      "status": "PREVIEW",
      "description": "Material de encuadre y kickoff de Fase 1."
    }
  ]
}'::jsonb
where dv.document_id = (select id from documents where slug='phase1-executive-report')
  and dv.is_current = true;

update document_versions dv
set preview_payload = '{
  "heading": "Fase 1 · Modelo económico",
  "summary": "Catálogo derivado de los workbooks reales utilizados en la evolución del business case. El viewer no entrega fórmulas ni archivos editables.",
  "items": [
    "Modelo económico base de entrada a Venezuela registrado en Drive",
    "Modelo AC BLIND utilizado como baseline operativo posterior",
    "Escenario S04 preservado como evidencia separada",
    "Los números Rev1 vigentes se gobiernan por el handoff S03/S04, no por recálculo en el navegador"
  ],
  "materials": [
    {
      "title": "DDS_Entrada_Venezuela_Modelo_Economico_v2.0_2026-08-30.xlsx",
      "type": "Workbook histórico · Drive source registered",
      "status": "PREVIEW",
      "description": "Modelo económico de entrada a Venezuela utilizado como antecedente del business case."
    },
    {
      "title": "DDS_Modelo_AC_BLIND.xlsx",
      "type": "Workbook controlado · Drive source registered",
      "status": "PREVIEW",
      "description": "Workbook canónico observado en Drive. El archivo editable permanece restringido."
    },
    {
      "title": "DDS_Modelo_AC_BLIND_S04_Scenario_Engine_2026-10-02.xlsx",
      "type": "Scenario-engine snapshot · Drive source registered",
      "status": "PREVIEW",
      "description": "Snapshot del selector S04 preservado como evidencia de cálculo y reconciliación."
    }
  ]
}'::jsonb
where dv.document_id = (select id from documents where slug='phase1-economic-model')
  and dv.is_current = true;

update document_versions dv
set preview_payload = '{
  "heading": "Fase 1 · Paquete de cierre",
  "summary": "El paquete ahora refleja documentos reales de cierre localizados en Drive. Se presenta metadata derivada y contenido resumido; los originales permanecen fuera del navegador.",
  "items": [
    "Fase 1 declarada completa para entrega",
    "Cobertura de compromisos y criterios de aceptación documentados",
    "Pendientes y responsables separados del cierre administrativo",
    "Fase 2 identificada como trabajo posterior sujeto a validación técnica, comercial, fiscal y societaria"
  ],
  "materials": [
    {
      "title": "00_Mandato_y_Cierre_Fase_1_DDS_2026-09-30.pdf",
      "type": "Documento final · Drive source registered",
      "status": "PREVIEW",
      "description": "Memorando final de definición del mandato y cierre de Fase 1."
    },
    {
      "title": "01_Propuesta_Comercial_DDS_Venezuela_2026-09-16.pdf",
      "type": "Commercial baseline · Drive source registered",
      "status": "PREVIEW",
      "description": "Propuesta comercial V2.0 que define alcance, inversión, entregables y límites de Fase 1/Fase 2."
    },
    {
      "title": "02_Memorando_Cierre_Fase_1_DDS_2026-09-30.docx",
      "type": "Closing memorandum · Drive source registered",
      "status": "PREVIEW",
      "description": "Documento editable de cierre identificado en el expediente documental."
    },
    {
      "title": "1_Cierre_Fases_y_Comunicaciones_2026-09-30.pdf",
      "type": "Closing communications · Drive source registered",
      "status": "PREVIEW",
      "description": "Paquete de cierre y comunicaciones del 30 de septiembre."
    }
  ]
}'::jsonb
where dv.document_id = (select id from documents where slug='phase1-closing-package')
  and dv.is_current = true;

update document_versions dv
set preview_payload = '{
  "heading": "Houston / Phase 2 Review Package · Rev1",
  "summary": "Paquete de revisión actualizado con evidencia real del rebase técnico-económico S01→S06. Las fuentes editables, contratos y workbooks permanecen restringidos.",
  "items": [
    "S01 · DDS Equipment Architecture v2.1 / EWERT_LEAN reconciled",
    "S02 · AFE 2F supplier-backed y nuevo AFE 3F CANDIDATE",
    "S03 · Financial Model Rev1 · computation valid / XLSX gate abierto",
    "S04 · Scenario Engine Rev1 · 20/20 QA / Excel gate abierto",
    "S05 · Visual Fleet Configurator · PR #7 candidate",
    "S06 · Governance Rev1 · merged to main; source/promotion/release gates active"
  ],
  "materials": [
    {
      "title": "DDS Minimum Equipment_ 2 Jobs_Rev0.xlsx",
      "type": "Supplier AFE · governed Drive source",
      "status": "PREVIEW",
      "description": "AFE 2F de Ewert/Austral. Gross USD 6,733,889; 4¾ opcional USD 179,603; required base USD 6,554,286."
    },
    {
      "title": "DDS Equipment_ 3 Jobs_Rev0.xlsx",
      "type": "Supplier AFE · NEW CANDIDATE",
      "status": "PREVIEW",
      "description": "AFE 3F recibido 2026-10-03. Gross USD 9,590,365; base ex 4¾ USD 9,410,762. G12 permanece abierto."
    },
    {
      "title": "DDS_S03_Rev1_Reconciliation_Report_CANDIDATE_2026-10-02.md",
      "type": "Financial reconciliation",
      "status": "PREVIEW",
      "description": "Reporte de reconciliación S03 Rev1. Cómputo válido; persistencia final XLSX G08 abierta."
    },
    {
      "title": "DDS_S04_Rev1_S05_Machine_Handoff_CANDIDATE_2026-10-03.zip",
      "type": "Scenario machine handoff",
      "status": "PREVIEW",
      "description": "Handoff S04→S05 con 20/20 QA. Excel final G09 permanece abierto."
    },
    {
      "title": "DDS_Governance_Rev1_Release_Control_Package_CANDIDATE_2026-10-03",
      "type": "Governance release-control package",
      "status": "PREVIEW",
      "description": "Source-of-truth, lifecycle, gates, PR integration plan y evidencia de release-control."
    },
    {
      "title": "Editable source workbooks / legal and contractual originals",
      "type": "Underlying source files",
      "status": "RESTRICTED",
      "description": "No se entregan al navegador mientras no exista SOURCE_RELEASED + grant explícito."
    }
  ],
  "marketIntelligence": [
    {
      "label": "2F supplier gross",
      "value": "USD 6.734M",
      "note": "Source-backed AFE Rev0."
    },
    {
      "label": "3F supplier candidate gross",
      "value": "USD 9.590M",
      "note": "New candidate; G12 normalization/reconciliation required before downstream promotion."
    },
    {
      "label": "Current 3F model control",
      "value": "USD 10.284M",
      "note": "MODEL_DERIVED control retained in current S04/S05 handoff until G12 closes."
    },
    {
      "label": "Ramp gross peak funding DSO90",
      "value": "USD 22.961M",
      "note": "GROSS PEAK FUNDING REQUIREMENT; not Required Equity."
    },
    {
      "label": "Ramp target funding capacity DSO90",
      "value": "USD 23.134M",
      "note": "Gross peak plus liquidity floor; financing structure remains a separate decision."
    },
    {
      "label": "LIH basis",
      "value": "NBV",
      "note": "Locked by Governance Rev1; USD 78k no-event desfase has zero liquidity effect absent event."
    }
  ]
}'::jsonb
where dv.document_id = (select id from documents where slug='houston-review-package')
  and dv.is_current = true;
