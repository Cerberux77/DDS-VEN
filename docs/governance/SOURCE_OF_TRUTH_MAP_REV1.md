# DDS Venezuela — Source-of-Truth Map Rev1

## Authority by surface

### Google Drive — documentary / commercial source of truth

Holds supplier AFEs, contracts, NDA, approved deliverables, minutes, financial workbooks, brand manual and controlled evidence. Original sensitive or supplier files are not bulk-copied to Git.

The monitored rebase folder is `ECONOMICAL TECNICAL REBASE`. Whitelisting is file-specific; presence in a folder is not authority.

### DDS-VEN — computational source + current presentation layer

Owns technical rules, normalized non-sensitive inputs, scenario logic, financial logic, schemas, tests, manifests and the current controlled deal-room/UI code.

S05 may be a **logical presentation domain** inside DDS-VEN. No separate deal-room repository exists in the current connected topology and none is created by S06.

### Oreshnik — control plane

Anchor: `Cerberux77/oreshnik#233`.

Owns task/run/gate/evidence/reconciliation/release-control semantics. Oreshnik does not duplicate application source or confidential Drive originals.

### Gmail — external communication layer

May supply inbound evidence and may hold generated drafts. Sensitive outbound send is independently gated by Manuel approval.

## Rev1 trace

```
Gmail / Drive supplier evidence
  ↓ whitelist + evidence capture
S02 normalization
  ↓
S01 physical rules + S02 asset economics
  ↓
S03 financial computation
  ↓
S04 scenario engine
  ↓ lookup-only authority
S05 UI
  ↓ tests / CI / visual gate
S06 governance evidence + PR
  ↓
Manuel approval
  ↓
Release
  ↓
Gmail draft
  ↓ Manuel send approval
External send
```

## Source-status taxonomy

- **SUPPLIER_BACKED**: direct supplier AFE/statement.
- **CONFIRMED_EWERT_PRACTICE**: operating practice attributed to Ewert; not automatically a legal/tax rule.
- **MODEL_DERIVED**: computed from governed rules/inputs, not supplier quotation.
- **MANAGEMENT_ASSUMPTION**: explicit planning input pending confirmation.
- **PENDING_EXTERNAL**: cannot resolve without external evidence.
- **CANDIDATE**: evidence/output exists but is not promoted to CURRENT.
