import { describe, it, expect } from 'vitest';
import { RequirementParser } from '../ai/requirementParser.js';
import { SupplierDiscoveryAgent } from '../ai/supplierAgent.js';
import { QuoteAnalysisAgent } from '../ai/quoteAgent.js';
import { NegotiationAgent } from '../ai/negotiationAgent.js';
import { RecommendationAgent } from '../ai/recommendationAgent.js';

describe('ProcureAI AI Procurement Engine Core Suite', () => {
  it('should accurately parse natural procurement prompt into structured schema', async () => {
    const prompt = 'Find 50 ergonomic office chairs under $12,000, delivered to Delhi within 30 days.';
    const parsed = await RequirementParser.parseFromPrompt(prompt);

    expect(parsed.quantity).toBe(50);
    expect(parsed.budget).toBe(12000);
    expect(parsed.currency).toBe('USD');
    expect(parsed.deliveryLocation).toBe('Delhi, India');
    expect(parsed.deadline).toBe('30 days');
    expect(parsed.category).toBe('Ergonomic Office Furniture');
  });

  it('should discover and rank suppliers according to SLA reliability and match criteria', async () => {
    const suppliers = await SupplierDiscoveryAgent.discoverAndRankSuppliers(
      'Ergonomic Office Furniture',
      'Delhi, India',
      50,
      []
    );

    expect(suppliers.length).toBeGreaterThan(0);
    expect(suppliers[0].matchScore).toBeGreaterThanOrEqual(80);
    expect(suppliers[0].vendor.name).toBeDefined();
  });

  it('should evaluate quotes and calculate multi-factor scores with pros/cons', () => {
    const defaultSuppliers = SupplierDiscoveryAgent.getDefaultVendorCatalog();
    const quotes = QuoteAnalysisAgent.evaluateQuotes(12000, 50, defaultSuppliers, [
      'Lumbar support',
      '5-year warranty',
    ]);

    expect(quotes.length).toBe(defaultSuppliers.length);
    expect(quotes[0].overallScore).toBeGreaterThan(80);
    expect(quotes[0].totalPrice).toBeLessThanOrEqual(12000);
    expect(quotes[0].aiPros.length).toBeGreaterThan(0);
  });

  it('should formulate tactical negotiation parameters and margin capture target', () => {
    const negPlan = NegotiationAgent.generateNegotiationPlan(
      'ErgoWorks Global',
      'v1',
      50,
      10700,
      'Ergonomic Office Furniture'
    );

    expect(negPlan.estimatedSavingPct).toBe(8.0);
    expect(negPlan.targetPrice).toBeLessThan(10700);
    expect(negPlan.suggestedPrompt).toContain('volume discount');
  });

  it('should synthesize executive recommendation with justified budget savings', () => {
    const defaultSuppliers = SupplierDiscoveryAgent.getDefaultVendorCatalog();
    const quotes = QuoteAnalysisAgent.evaluateQuotes(12000, 50, defaultSuppliers, []);
    const recommendation = RecommendationAgent.synthesizeRecommendation(12000, quotes, 30);

    expect(recommendation.recommendedQuote.vendorName).toBe('ErgoWorks Global');
    expect(recommendation.totalSavingsVsBudget).toBeGreaterThan(0);
    expect(recommendation.keyJustificationPillars.length).toBe(4);
  });
});
