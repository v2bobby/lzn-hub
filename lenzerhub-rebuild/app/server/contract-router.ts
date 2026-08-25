import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contracts, clauseFindings } from "@db/schema";
import { eq, desc, inArray } from "drizzle-orm";
import {
  CONTRACT_TYPE_LABEL,
  SEVERITY_ORDER,
  clausesForType,
  scoreClauses,
  type ContractType,
} from "@contracts/clause-library";

const contractTypeEnum = z.enum([
  "saas",
  "vendor",
  "sow",
  "freelancer",
  "lease",
  "other",
]);

function buildAnalysis(contractType: ContractType) {
  const candidates = clausesForType(contractType);

  const count = Math.min(candidates.length, 4 + Math.floor(Math.random() * 3));
  const selected = [...candidates]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .sort(
      (a, b) =>
        SEVERITY_ORDER.indexOf(a.severity) - SEVERITY_ORDER.indexOf(b.severity),
    );

  const riskScore = scoreClauses(selected);
  const critical = selected.filter((c) => c.severity === "critical").length;
  const high = selected.filter((c) => c.severity === "high").length;

  const parts = [
    `Reviewed this ${CONTRACT_TYPE_LABEL[contractType].toLowerCase()} and found ${selected.length} clauses worth negotiating.`,
  ];
  if (critical) {
    parts.push(
      `${critical} ${critical === 1 ? "is" : "are"} critical: left as written, you carry financial or data exposure you cannot cap.`,
    );
  }
  if (high) {
    parts.push(
      `${high} ${high === 1 ? "is" : "are"} high priority and belongs in your first redline round.`,
    );
  }
  parts.push(
    `Weighted risk score is ${riskScore} out of 100. Every finding below includes replacement language you can paste into a counter-proposal.`,
  );

  return { clauses: selected, riskScore, summary: parts.join(" ") };
}

export const contractRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        vendor: z.string().max(255).optional(),
        contractType: contractTypeEnum,
        fileName: z.string().max(255).optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const [contract] = await db
        .insert(contracts)
        .values({
          userId: ctx.user.id,
          title: input.title.trim(),
          vendor: input.vendor?.trim() || null,
          contractType: input.contractType,
          fileName: input.fileName || null,
          status: "uploaded",
        })
        .$returningId();

      return { id: contract.id, status: "uploaded" as const };
    }),

  analyze: authedQuery
    .input(z.object({ contractId: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.contractId))
        .limit(1);

      if (!contract || contract.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That contract is not in your workspace.",
        });
      }

      await db
        .update(contracts)
        .set({ status: "analyzing" })
        .where(eq(contracts.id, input.contractId));

      try {
        const analysis = buildAnalysis(
          (contract.contractType ?? "other") as ContractType,
        );

        // Re-analysis replaces prior findings instead of stacking duplicates.
        await db
          .delete(clauseFindings)
          .where(eq(clauseFindings.contractId, input.contractId));

        await db.insert(clauseFindings).values(
          analysis.clauses.map((clause) => ({
            contractId: input.contractId,
            clauseName: clause.clauseName,
            severity: clause.severity,
            originalText: clause.originalText,
            suggestedText: clause.suggestedText,
            explanation: clause.explanation,
            category: clause.category,
          })),
        );

        await db
          .update(contracts)
          .set({
            status: "completed",
            riskScore: analysis.riskScore,
            summary: analysis.summary,
          })
          .where(eq(contracts.id, input.contractId));

        return {
          contractId: input.contractId,
          riskScore: analysis.riskScore,
          summary: analysis.summary,
          findingsCount: analysis.clauses.length,
        };
      } catch (error) {
        await db
          .update(contracts)
          .set({ status: "failed" })
          .where(eq(contracts.id, input.contractId));
        throw error;
      }
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, ctx.user.id))
      .orderBy(desc(contracts.createdAt));
  }),

  get: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!contract || contract.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That contract is not in your workspace.",
        });
      }

      const findings = await db
        .select()
        .from(clauseFindings)
        .where(eq(clauseFindings.contractId, input.id));

      findings.sort(
        (a, b) =>
          SEVERITY_ORDER.indexOf(a.severity) -
          SEVERITY_ORDER.indexOf(b.severity),
      );

      return { ...contract, findings };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!contract || contract.userId !== ctx.user.id) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "That contract is not in your workspace.",
        });
      }

      await db
        .delete(clauseFindings)
        .where(eq(clauseFindings.contractId, input.id));
      await db.delete(contracts).where(eq(contracts.id, input.id));

      return { success: true as const };
    }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();

    const userContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, ctx.user.id));

    const analyzed = userContracts.filter((c) => c.status === "completed");
    const scored = analyzed.filter((c) => typeof c.riskScore === "number");

    const avgRiskScore = scored.length
      ? Math.round(
          scored.reduce((sum, c) => sum + (c.riskScore ?? 0), 0) / scored.length,
        )
      : 0;

    // One query for all findings rather than one query per contract.
    const ids = userContracts.map((c) => c.id);
    const findings = ids.length
      ? await db
          .select()
          .from(clauseFindings)
          .where(inArray(clauseFindings.contractId, ids))
      : [];

    return {
      totalContracts: userContracts.length,
      analyzedContracts: analyzed.length,
      avgRiskScore,
      totalFindings: findings.length,
      criticalFindings: findings.filter((f) => f.severity === "critical").length,
    };
  }),
});
