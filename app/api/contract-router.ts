import { z } from "zod";
import { createRouter, authedQuery } from "./middleware";
import { getDb } from "./queries/connection";
import { contracts, clauseFindings } from "@db/schema";
import { eq, desc } from "drizzle-orm";

// Mock AI analysis data - realistic contract risk findings
const MOCK_CLAUSE_LIBRARY: Array<{
  clauseName: string;
  severity: "critical" | "high" | "medium" | "low";
  category: string;
  originalText: string;
  suggestedText: string;
  explanation: string;
}> = [
  {
    clauseName: "Auto-Renewal Clause",
    severity: "critical",
    category: "Renewal Terms",
    originalText: "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 10 days prior to the end of the then-current term.",
    suggestedText: "This Agreement shall automatically renew for successive one-year terms unless either party provides written notice of termination at least 60 days prior to the end of the then-current term.",
    explanation: "A 10-day notice window is extremely restrictive. Most vendors require 30-90 days. You risk being locked into another year before you can evaluate alternatives.",
  },
  {
    clauseName: "Liability Cap",
    severity: "critical",
    category: "Liability",
    originalText: "Vendor's total liability shall not exceed the total amount paid by Customer under this Agreement in the twelve months preceding the claim.",
    suggestedText: "Vendor's total liability shall not exceed the greater of (a) $500,000 or (b) the total amount paid by Customer under this Agreement in the twelve months preceding the claim.",
    explanation: "An uncapped liability clause leaves you with no recourse if the vendor's negligence causes significant damage. A floor of $500K is standard for SMBs.",
  },
  {
    clauseName: "Indemnification Scope",
    severity: "high",
    category: "Indemnification",
    originalText: "Customer shall indemnify and hold harmless Vendor from any claims arising from Customer's use of the Services.",
    suggestedText: "Each party shall indemnify the other from third-party claims arising from the indemnifying party's negligence, willful misconduct, or breach of this Agreement.",
    explanation: "This is a one-sided indemnification clause. You are agreeing to protect the vendor from ALL claims, even those caused by their own negligence. Mutual indemnification is standard.",
  },
  {
    clauseName: "Data Ownership",
    severity: "high",
    category: "Data Rights",
    originalText: "Vendor may use Customer Data to improve its services and for any other business purpose.",
    suggestedText: "Vendor may use aggregated, de-identified Customer Data solely for the purpose of improving its services. Vendor shall not sell, license, or otherwise transfer Customer Data to third parties.",
    explanation: "This clause gives the vendor broad rights to use your data for any purpose, including potentially selling insights derived from it. Limit usage to service improvement only.",
  },
  {
    clauseName: "Termination for Convenience",
    severity: "medium",
    category: "Termination",
    originalText: "This Agreement may be terminated by either party for any reason upon 30 days written notice.",
    suggestedText: "This Agreement may be terminated by Customer for any reason upon 30 days written notice. Vendor may terminate only for material breach by Customer after 60 days cure period.",
    explanation: "Symmetrical termination for convenience gives the vendor the right to terminate your service with only 30 days notice. As the customer, you should have more flexibility to leave than the vendor has to kick you out.",
  },
  {
    clauseName: "Service Level Agreement",
    severity: "medium",
    category: "Performance",
    originalText: "Vendor shall use commercially reasonable efforts to ensure the Services are available 99% of the time.",
    suggestedText: "Vendor shall ensure the Services are available 99.9% of the time, measured monthly. Downtime exceeding 4 hours in a month entitles Customer to a 10% monthly credit.",
    explanation: "99% uptime allows for over 7 hours of downtime per month with no recourse. Industry standard is 99.9% with service credits for extended outages.",
  },
  {
    clauseName: "Price Increase Clause",
    severity: "medium",
    category: "Pricing",
    originalText: "Vendor may increase pricing by up to 15% annually upon 30 days written notice.",
    suggestedText: "Vendor may increase pricing by up to 5% annually upon 90 days written notice. Increases exceeding 5% require Customer's written consent.",
    explanation: "A 15% annual increase with only 30 days notice can significantly impact your budget. Cap increases at 5% with 90 days notice to maintain budget predictability.",
  },
  {
    clauseName: "IP Assignment",
    severity: "low",
    category: "Intellectual Property",
    originalText: "Any suggestions or feedback provided by Customer may be used by Vendor without restriction.",
    suggestedText: "Any suggestions or feedback provided by Customer may be used by Vendor without restriction, provided Vendor does not disclose Customer's identity without consent.",
    explanation: "While common, you may want to add an anonymity clause so your strategic feedback isn't publicly attributed to your company.",
  },
];

function generateMockAnalysis(contractType: string) {
  // Select 4-6 relevant clauses based on contract type
  const allClauses = [...MOCK_CLAUSE_LIBRARY];
  const shuffled = allClauses.sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, 4 + Math.floor(Math.random() * 3));

  // Calculate risk score
  const severityWeights = { critical: 4, high: 3, medium: 2, low: 1 };
  const totalWeight = selected.reduce((sum, c) => sum + severityWeights[c.severity], 0);
  const maxWeight = selected.length * 4;
  const riskScore = Math.round((totalWeight / maxWeight) * 100);

  const criticalCount = selected.filter(c => c.severity === "critical").length;
  const highCount = selected.filter(c => c.severity === "high").length;

  let summary = `Our AI analyzed this ${contractType} contract and identified ${selected.length} potential risk areas.`;
  if (criticalCount > 0) {
    summary += ` ${criticalCount} critical issue(s) require immediate attention — these could result in significant financial exposure or loss of data rights.`;
  }
  if (highCount > 0) {
    summary += ` ${highCount} high-priority finding(s) should be addressed during negotiation.`;
  }
  summary += ` Overall risk score: ${riskScore}/100. Review the detailed findings below and use our suggested counter-language during your next negotiation.`;

  return { clauses: selected, riskScore, summary };
}

export const contractRouter = createRouter({
  create: authedQuery
    .input(
      z.object({
        title: z.string().min(1).max(255),
        vendor: z.string().optional(),
        contractType: z.enum(["saas", "vendor", "sow", "freelancer", "lease", "other"]),
        fileName: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const [contract] = await db.insert(contracts).values({
        userId,
        title: input.title,
        vendor: input.vendor || null,
        contractType: input.contractType,
        fileName: input.fileName || null,
        status: "uploaded",
      }).$returningId();

      return { id: contract.id, status: "uploaded" };
    }),

  analyze: authedQuery
    .input(z.object({ contractId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      // Get the contract
      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.contractId))
        .limit(1);

      if (!contract || contract.userId !== userId) {
        throw new Error("Contract not found");
      }

      // Update status to analyzing
      await db
        .update(contracts)
        .set({ status: "analyzing" })
        .where(eq(contracts.id, input.contractId));

      // Generate mock analysis
      const analysis = generateMockAnalysis(contract.contractType || "vendor");

      // Insert clause findings
      for (const clause of analysis.clauses) {
        await db.insert(clauseFindings).values({
          contractId: input.contractId,
          clauseName: clause.clauseName,
          severity: clause.severity,
          originalText: clause.originalText,
          suggestedText: clause.suggestedText,
          explanation: clause.explanation,
          category: clause.category,
        });
      }

      // Update contract with results
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
    }),

  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;
    return db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, userId))
      .orderBy(desc(contracts.createdAt));
  }),

  get: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!contract || contract.userId !== userId) {
        throw new Error("Contract not found");
      }

      const findings = await db
        .select()
        .from(clauseFindings)
        .where(eq(clauseFindings.contractId, input.id))
        .orderBy(clauseFindings.severity);

      return { ...contract, findings };
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = getDb();
      const userId = ctx.user.id;

      const [contract] = await db
        .select()
        .from(contracts)
        .where(eq(contracts.id, input.id))
        .limit(1);

      if (!contract || contract.userId !== userId) {
        throw new Error("Contract not found");
      }

      await db.delete(clauseFindings).where(eq(clauseFindings.contractId, input.id));
      await db.delete(contracts).where(eq(contracts.id, input.id));

      return { success: true };
    }),

  stats: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    const userId = ctx.user.id;

    const userContracts = await db
      .select()
      .from(contracts)
      .where(eq(contracts.userId, userId));

    const totalContracts = userContracts.length;
    const analyzedContracts = userContracts.filter(c => c.status === "completed").length;
    const avgRiskScore = analyzedContracts > 0
      ? Math.round(userContracts.filter(c => c.riskScore).reduce((sum, c) => sum + (c.riskScore || 0), 0) / analyzedContracts)
      : 0;

    // Get total findings
    let totalFindings = 0;
    let criticalFindings = 0;
    for (const c of userContracts) {
      const findings = await db
        .select()
        .from(clauseFindings)
        .where(eq(clauseFindings.contractId, c.id));
      totalFindings += findings.length;
      criticalFindings += findings.filter(f => f.severity === "critical").length;
    }

    return { totalContracts, analyzedContracts, avgRiskScore, totalFindings, criticalFindings };
  }),
});
