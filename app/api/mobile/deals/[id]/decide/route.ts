import { db } from "@/lib/db";
import { deals, feedback } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { requireMobileToken, unauthorizedResponse, badRequestResponse } from "@/lib/mobile-auth";

const actions = ["APPROVE", "COUNTER"] as const;
type DecisionAction = (typeof actions)[number];

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  let claims;
  try {
    claims = await requireMobileToken(request);
  } catch {
    return unauthorizedResponse();
  }

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return badRequestResponse("Invalid JSON");
  }

  const action = body && typeof body === "object" ? (body as { action?: unknown }).action : undefined;
  if (!actions.includes(action as DecisionAction)) {
    return badRequestResponse("Action must be APPROVE or COUNTER");
  }
  const decisionAction = action as DecisionAction;

  const deal = await db.query.deals.findFirst({ where: eq(deals.id, id) });
  if (!deal) return Response.json({ error: "Deal not found" }, { status: 404 });
  if (deal.status !== "PENDING") return badRequestResponse("Deal has already been decided");

  const nextStatus: "APPROVED" | "COUNTERED" = decisionAction === "APPROVE" ? "APPROVED" : "COUNTERED";
  await db.transaction(async (tx) => {
    await tx.update(deals).set({ status: nextStatus, updatedAt: new Date() }).where(eq(deals.id, id));
    await tx.insert(feedback).values({
      dealId: id,
      action: decisionAction,
      justification: `${action} via mobile by ${claims.name}`,
    });
  });

  return Response.json({ id, status: nextStatus, action });
}
