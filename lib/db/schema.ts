import {
  pgTable,
  text,
  integer,
  decimal,
  timestamp,
  uuid,
  varchar,
  pgEnum,
  vector,
  jsonb,
} from "drizzle-orm/pg-core";

export const verdictEnum = pgEnum("verdict", ["APPROVE", "COUNTER", "ALTERNATIVE"]);
export const statusEnum = pgEnum("status", ["PENDING", "APPROVED", "COUNTERED", "REJECTED"]);

export const segments = pgTable("segments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  model: text("model"),
  qmin: integer("qmin"),
  qspan: integer("qspan"),
  median: decimal("median", { precision: 5, scale: 2 }),
  k: decimal("k", { precision: 5, scale: 2 }).array(),
  m: decimal("m", { precision: 5, scale: 2 }).array(),
  insight: text("insight"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const customers = pgTable("customers", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  segmentId: integer("segment_id").references(() => segments.id),
  avgPayDays: integer("avg_pay_days"),
  riskProfile: text("risk_profile"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const deals = pgTable("deals", {
  id: varchar("id", { length: 20 }).primaryKey(), // D-xxxx
  customerId: uuid("customer_id").references(() => customers.id),
  status: statusEnum("status").default("PENDING"),
  requestedValue: text("requested_value"),
  requestedPct: decimal("requested_pct", { precision: 5, scale: 2 }),
  quantity: integer("quantity"),
  config: text("config"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  marginAtRec: decimal("margin_at_rec", { precision: 5, scale: 2 }),
  floorPct: decimal("floor_pct", { precision: 5, scale: 2 }),
  recPct: decimal("rec_pct", { precision: 5, scale: 2 }),
  verdict: verdictEnum("verdict"),
  verdictLong: text("verdict_long"),
  summary: text("summary"),
  recommendation: text("recommendation"),
  reason: text("reason"),
  precedentSummary: text("precedent_summary"),
  embedding: vector("embedding", { dimensions: 3 }), // [requested_pct, quantity, segment_id]
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").defaultRandom().primaryKey(),
  dealId: varchar("deal_id", { length: 20 }).references(() => deals.id),
  action: text("action"),
  justification: text("justification"),
  createdAt: timestamp("created_at").defaultNow(),
});

import { relations } from "drizzle-orm";

export const segmentsRelations = relations(segments, ({ many }) => ({
  customers: many(customers),
}));

export const customersRelations = relations(customers, ({ one, many }) => ({
  segment: one(segments, {
    fields: [customers.segmentId],
    references: [segments.id],
  }),
  deals: many(deals),
}));

export const dealsRelations = relations(deals, ({ one, many }) => ({
  customer: one(customers, {
    fields: [deals.customerId],
    references: [customers.id],
  }),
  feedbacks: many(feedback),
}));

export const feedbackRelations = relations(feedback, ({ one }) => ({
  deal: one(deals, {
    fields: [feedback.dealId],
    references: [deals.id],
  }),
}));

export const scenarios = pgTable("scenarios", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  config: text("config"), // JSON string of segment budgets
  totalSpend: decimal("total_spend", { precision: 10, scale: 2 }),
  projectedDelta: integer("projected_delta"),
  snapshotId: varchar("snapshot_id", { length: 64 }), // current model version
  createdAt: timestamp("created_at").defaultNow(),
});

export const config = pgTable("config", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  description: text("description"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dataSources = pgTable("data_sources", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  status: text("status").notNull().default("Connected"),
  lastSync: timestamp("last_sync").defaultNow(),
  mapping: jsonb("mapping").default({}),
});
