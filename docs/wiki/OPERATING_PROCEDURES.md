# Marginguard Operating Codex

Welcome to the **Marginguard Incentives OS**. This platform is designed to optimize the "True Dollar" response across the Truck OEM ecosystem.

## 01. The Core Philosophy: True Dollar Response
Not every incentive dollar is equal. A $1,000 discount to a Vocational buyer has a different ROI than $1,000 in Financing Assistance to an Owner-Operator. 
*   **The Goal**: Maximize unit volume while minimizing margin erosion.
*   **The Method**: Real-time response curve modeling and agentic deal auditing.

## 02. The Intelligence Feed
Located in the **Insights** tab, this feed surfaces anomalies:
*   **Hot Segments**: Where requested discounts are trending above historical medians.
*   **Under-Response**: Where current incentive mixes are failing to drive volume.

## 03. Tactical Deal Approval
When reviewing a deal:
1.  **Check Confidence**: AI confidence reflects how closely the deal matches winning precedents.
2.  **Verify the Verdict**: Counter-offers are generated when the requested discount is >0.6% above the segment median.
3.  **Submit Justification**: Every override is logged to the Audit Trail to train the local model.

## 04. Strategic Planning
Use the **Workbench** to reallocate capital:
*   **Rebalance for ROI**: Shifts budget from "Flat" curves (low response) to "Steep" curves (high response).
*   **Scenario Testing**: Save different mixes to compare projected incremental units vs. baseline.

## 05. Data Sovereignty: Field Mapping Protocol
The engine requires a "True North" dataset. The platform has evolved from a simple registry into a robust Field Mapping Protocol.
*   **Protocol Definition**: Every data source must map its unique keys (e.g., `legal_name`) to the Marginguard Intelligence Schema (`customer_name`).
*   **Verification (Sprint 5)**: Before going live, administrators use the "Test Protocol" to run a simulation. This ensures data fidelity before ingestion.
*   **Reconciliation**: If a mapping protocol is updated, the system can retroactively "re-patch" historical deals to maintain a consistent analytical baseline.

## 06. The Intelligence Evolution (Sprint 3 → 5)
Marginguard has transitioned through three critical phases of development:

### Phase 1: The Strategic Registry (Sprint 3)
Built the foundation for multi-scenario planning and data source tracking. Introduced the **Planning Workbench** and the ability to model "True Dollar" response curves across distinct market segments.

### Phase 2: The Production Shield (Sprint 4)
Hardened the platform for boardroom-ready deployment. 
*   **Identity**: Implemented Auth.js with Role-Based Access Control (RBAC). 
*   **Persistence**: Migrated to a high-performance Drizzle ORM layer with PostgreSQL + pgvector for semantic search.
*   **Performance**: Optimized rendering for high-cardinality data sets (handling 100+ segments with sub-second latency).

### Phase 3: The Live Engine (Sprint 5)
Activating the background ingestion layer.
*   **Workers**: Background processes that poll external systems (ERP/CRM) and apply the defined Mapping Protocol.
*   **Verification**: Interactive simulators that preview how external records will look inside the intelligence engine before they hit the Approval Queue.
*   **Automated Auditing**: Every ingested record is semantic-indexed (pgvector), allowing the system to surface "Similar Deals" instantly during approval.
