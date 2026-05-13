Changed `sdk/src/agents.ts` (93 lines), `sdk/src/idkit-optional.d.ts` (5), `sdk/humanauth-react.tsx` (425), `sdk/src/index.ts` (98), `sdk/README.md` (219), package metadata, and rebuilt `sdk/dist`.
Added a typed `HumadAgentClient` wrapper for L3 start/finalize/list APIs and exported it from the main SDK entry.
Added `AuthorizeAgent` to the existing React entry; it renders the QR from `startAgentRegistration` and finalizes when `pendingProof` is supplied.
Bumped `humad-sdk` to `0.4.0`; caveat: World ID / IDKit callback handling remains external and must pass `pendingProof`.
