-- DDS-VEN Phase 2 controlled review package enrichment.
-- This migration updates derived preview metadata only. It never inserts source file URLs or bytes.

update document_versions dv
set preview_payload = jsonb_build_object(
  'heading', 'Houston Review Package',
  'summary', 'Curated Phase 2 material for executive review. Underlying formulas, editable workbooks and non-approved strategic materials remain restricted.',
  'items', jsonb_build_array(
    'Economic case — approved review outputs',
    'Operating ramp — selected assumptions',
    'Organization and capability structure — review version',
    'Venezuela drilling outlook — controlled market-intelligence estimate',
    'Decision points and open validations'
  ),
  'materials', jsonb_build_array(
    jsonb_build_object(
      'title','Economic case — approved review outputs',
      'type','Derived financial review',
      'status','PREVIEW',
      'description','Executive outputs from the 24-month economic model. Editable workbook and formulas remain restricted.'
    ),
    jsonb_build_object(
      'title','Operating ramp — selected assumptions',
      'type','Operating assumptions',
      'status','PREVIEW',
      'description','Ramp from structuring to operations, selected utilization assumptions and review checkpoints.'
    ),
    jsonb_build_object(
      'title','DDS Estructura Organizacional — 2026-09-30',
      'type','Derived organization review',
      'status','PREVIEW',
      'description','Preliminary organization and capability structure prepared for Phase 2 review and adjustment.'
    ),
    jsonb_build_object(
      'title','Venezuela Drilling Intelligence — 2026-10-01',
      'type','Market-intelligence review',
      'status','PREVIEW',
      'description','Field-intelligence rig outlook. Estimates are separated from public rig-count reporting.'
    ),
    jsonb_build_object(
      'title','Editable workbooks, presentations and source models',
      'type','Underlying source files',
      'status','RESTRICTED',
      'description','Source files are not delivered to the browser while the document remains in PREVIEW.'
    )
  ),
  'marketIntelligence', jsonb_build_array(
    jsonb_build_object(
      'label','Current field-confirmed estimate',
      'value','4 rigs',
      'note','2 Chevron + 2 PetroMonagas. Internal market intelligence; not presented as a public certified rig count.'
    ),
    jsonb_build_object(
      'label','Chevron additional readiness',
      'value','2 rigs',
      'note','At least two additional rigs in preparation: one associated with Block 8 and one with Petropiar.'
    ),
    jsonb_build_object(
      'label','NAVE(P) in-country readiness',
      'value','2 rigs',
      'note','Two new rigs reported as already in-country and in preparation.'
    ),
    jsonb_build_object(
      'label','NAVE(P) additional transit',
      'value','4 rigs',
      'note','Four additional rigs reported in transit. Timing remains a market-intelligence estimate.'
    ),
    jsonb_build_object(
      'label','End-2027 planning reference',
      'value','10 rigs',
      'note','Reported planning reference for the cited program/horizon. Not arithmetically combined here with overlapping readiness buckets.'
    ),
    jsonb_build_object(
      'label','Eni plan',
      'value','5 rigs',
      'note','Additional five-rig plan reported as market intelligence; timing and activation remain subject to program execution.'
    )
  )
)
where dv.document_id = (select id from documents where slug='houston-review-package')
  and dv.is_current = true;
