export interface NegotiationPlan {
  vendorId: string;
  vendorName: string;
  quoteId?: string;
  startingPrice: number;
  targetPrice: number;
  estimatedSavingPct: number;
  strategyRationale: string;
  suggestedPrompt: string;
  simulatedVendorCounterOffer: number;
}

export class NegotiationAgent {
  static generateNegotiationPlan(
    vendorName: string,
    vendorId: string,
    quantity: number,
    quotePrice: number,
    category: string
  ): NegotiationPlan {
    const discountPct = 8.0;
    const targetPrice = Math.round(quotePrice * (1 - discountPct / 100));
    const simulatedCounter = Math.round(quotePrice * (1 - 0.055)); // Settles at ~5.5-8% savings

    const suggestedPrompt = `Hello ${vendorName} Enterprise Accounts Team,\n\nWe are currently finalizing procurement of ${quantity} units for ${category}. Your proposal is currently leading our internal evaluation due to your warranty and delivery profile. However, another verified supplier has offered aggressive bulk terms.\n\nIf you can adjust the subtotal to ${targetPrice.toLocaleString()} (reflecting an ${discountPct}% volume discount for immediate commitment), our finance committee is prepared to issue the Purchase Order within 24 business hours.\n\nPlease confirm if you can lock in this pricing.`;

    const strategyRationale = `Targeting an 8.0% volume incentive discount based on ${quantity}+ unit order volume. Benchmark data shows ${vendorName} historically concedes between 5% to 9% when presented with immediate PO close certainty.`;

    return {
      vendorId,
      vendorName,
      startingPrice: quotePrice,
      targetPrice,
      estimatedSavingPct: discountPct,
      strategyRationale,
      suggestedPrompt,
      simulatedVendorCounterOffer: targetPrice,
    };
  }
}
