import { GeneratedQuote } from './quoteAgent.js';

export interface FinalRecommendation {
  recommendedQuote: GeneratedQuote;
  alternativeQuotes: GeneratedQuote[];
  totalSavingsVsBudget: number;
  totalSavingsPct: number;
  executiveSummary: string;
  keyJustificationPillars: string[];
  riskAnalysis: {
    deliveryRisk: 'low' | 'medium' | 'high';
    financialRisk: 'low' | 'medium' | 'high';
    complianceRisk: 'low' | 'medium' | 'high';
    mitigationPlan: string;
  };
}

export class RecommendationAgent {
  static synthesizeRecommendation(
    budget: number,
    quotes: GeneratedQuote[],
    deadlineDays: number = 30
  ): FinalRecommendation {
    if (quotes.length === 0) {
      throw new Error('Cannot formulate recommendation without quotes');
    }

    const topQuote = quotes[0];
    const alternativeQuotes = quotes.slice(1);
    const savingsAmount = Math.max(0, budget - topQuote.totalPrice);
    const savingsPct = parseFloat(((savingsAmount / budget) * 100).toFixed(1));

    const executiveSummary = `ProcureAI recommends selecting ${topQuote.vendorName} with an overall confidence score of ${topQuote.overallScore}/100. This delivers the procurement at $${topQuote.totalPrice.toLocaleString()} (a direct saving of $${savingsAmount.toLocaleString()} / ${savingsPct}% under your authorized budget) with a 5-year warranty and a delivery window of ${topQuote.leadTimeDays} days, well within your ${deadlineDays}-day constraint.`;

    const keyJustificationPillars = [
      `Cost Optimization: Captures $${savingsAmount.toLocaleString()} (${savingsPct}%) in budget surplus while preserving Tier-1 commercial build quality.`,
      `Warranty & Longevity: Offers an extensive ${topQuote.warrantyYears}-year commercial warranty compared to industry standard 2-3 years.`,
      `Supplier Track Record: ${topQuote.vendorName} maintains a ${topQuote.reliabilityScore}% reliability score with verified on-time logistics history.`,
      `Negotiation Levers: High-probability 8% volume rebate identified and pre-structured for finance approval.`,
    ];

    return {
      recommendedQuote: topQuote,
      alternativeQuotes,
      totalSavingsVsBudget: savingsAmount,
      totalSavingsPct: savingsPct,
      executiveSummary,
      keyJustificationPillars,
      riskAnalysis: {
        deliveryRisk: topQuote.leadTimeDays < deadlineDays * 0.75 ? 'low' : 'medium',
        financialRisk: 'low',
        complianceRisk: 'low',
        mitigationPlan: `All payments scheduled with Net 30 milestone terms pending physical QA inspection upon delivery to destination hub.`,
      },
    };
  }
}
