import mongoose from 'mongoose';
import {
  ProcurementRequest,
  Vendor,
  Quote,
  AgentEvent,
  Negotiation,
  Approval,
  PurchaseOrder,
  AuditLog,
  Notification,
  RFQ,
} from '../models/index.js';
import { RequirementParser } from './requirementParser.js';
import { SupplierDiscoveryAgent } from './supplierAgent.js';
import { QuoteAnalysisAgent } from './quoteAgent.js';
import { NegotiationAgent } from './negotiationAgent.js';
import { RecommendationAgent } from './recommendationAgent.js';

export class ProcurementOrchestrator {
  static async runFullProcurementCycle(
    procurementId: string,
    companyId: string,
    userId: string,
    onEventCallback?: (event: any) => void
  ) {
    const procurement = await ProcurementRequest.findOne({ _id: procurementId, companyId });
    if (!procurement) throw new Error('Procurement request not found');

    const createEvent = async (
      stage: string,
      eventType: 'requirement' | 'discovery' | 'rfq' | 'quote' | 'negotiation' | 'recommendation' | 'approval' | 'po',
      title: string,
      detail: string,
      iconType: string = 'CheckCircle2',
      metadata?: Record<string, any>
    ) => {
      const now = new Date();
      const timeStr = now.toTimeString().substring(0, 5);
      const event = await AgentEvent.create({
        procurementId: procurement._id,
        companyId: new mongoose.Types.ObjectId(companyId),
        stage,
        eventType,
        title,
        detail,
        timestamp: timeStr,
        iconType,
        metadata,
      });

      if (onEventCallback) {
        onEventCallback(event);
      }
      return event;
    };

    // Stage 1: Requirement Understanding
    procurement.status = 'understanding';
    procurement.assignedAgentStage = 'Requirement Understanding';
    procurement.agentProgressPct = 20;
    await procurement.save();

    await createEvent(
      'Requirement Parser',
      'requirement',
      'Requirement Understood & Structured',
      `Parsed: ${procurement.quantity} units of "${procurement.title}" for budget ${procurement.currency} ${procurement.budget.toLocaleString()} destined for ${procurement.deliveryLocation}.`,
      'Brain'
    );

    // Stage 2: Supplier Discovery
    procurement.status = 'supplier_discovery';
    procurement.assignedAgentStage = 'Supplier Discovery & RFQ Dispatch';
    procurement.agentProgressPct = 40;
    await procurement.save();

    const existingVendors = await Vendor.find({
      $or: [{ companyId: new mongoose.Types.ObjectId(companyId) }, { isGlobalVendor: true }],
    });

    const discoveredSuppliers = await SupplierDiscoveryAgent.discoverAndRankSuppliers(
      procurement.category,
      procurement.deliveryLocation,
      procurement.quantity,
      existingVendors
    );

    await createEvent(
      'Supplier Discovery',
      'discovery',
      `Discovered ${discoveredSuppliers.length} Qualified Enterprise Suppliers`,
      `Ranked top suppliers: ${discoveredSuppliers.map((s) => s.vendor.name).slice(0, 3).join(', ')}. Matching criteria: Category suitability, geographic hub & verified SLA ratings.`,
      'Search'
    );

    // Stage 3: RFQ & Quotation Collection
    procurement.status = 'rfq_sent';
    procurement.assignedAgentStage = 'Quotation Ingestion & Multi-Criteria Matrix';
    procurement.agentProgressPct = 60;
    await procurement.save();

    await createEvent(
      'RFQ Engine',
      'rfq',
      `Dispatched Standard RFQ Packages to ${discoveredSuppliers.length} Suppliers`,
      `Sent formal Request for Quotation including technical specs, commercial warranty covenants, and delivery window: ${procurement.requiredByDate}.`,
      'Send'
    );

    const generatedQuotes = QuoteAnalysisAgent.evaluateQuotes(
      procurement.budget,
      procurement.quantity,
      discoveredSuppliers,
      procurement.specs.keyRequirements
    );

    // Persist quotes in DB
    await Quote.deleteMany({ procurementId: procurement._id });
    const savedQuotes = [];
    for (let i = 0; i < generatedQuotes.length; i++) {
      const gq = generatedQuotes[i];
      let vendorDoc = await Vendor.findOne({ name: gq.vendorName });
      if (!vendorDoc) {
        vendorDoc = await Vendor.create({
          name: gq.vendorName,
          companyId: new mongoose.Types.ObjectId(companyId),
          categories: [procurement.category],
          reliabilityScore: gq.reliabilityScore,
          qualityScore: gq.complianceScore,
          averageDeliveryDays: gq.leadTimeDays,
          location: procurement.deliveryLocation,
          contacts: [{ name: 'Enterprise Sales', email: `sales@${gq.vendorName.toLowerCase().replace(/\s+/g, '')}.com` }],
          verifiedSupplier: true,
        });
      }

      // Create RFQ record for the vendor so it appears in their vendor portal
      await RFQ.create({
        procurementRequestId: procurement._id,
        companyId: new mongoose.Types.ObjectId(companyId),
        vendorId: vendorDoc._id,
        title: procurement.title,
        category: procurement.category,
        quantity: procurement.quantity,
        budget: procurement.budget,
        currency: procurement.currency,
        deliveryLocation: procurement.deliveryLocation,
        requiredByDate: procurement.requiredByDate,
        specifications: procurement.specs.keyRequirements || [],
        status: 'quoted',
        sentAt: new Date(),
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      });

      const qDoc = await Quote.create({
        procurementId: procurement._id,
        vendorId: vendorDoc._id,
        vendorName: gq.vendorName,
        companyId: new mongoose.Types.ObjectId(companyId),
        unitPrice: gq.unitPrice,
        totalPrice: gq.totalPrice,
        originalPrice: gq.originalPrice,
        currency: procurement.currency,
        leadTimeDays: gq.leadTimeDays,
        warrantyYears: gq.warrantyYears,
        overallScore: gq.overallScore,
        priceScore: gq.priceScore,
        reliabilityScore: gq.reliabilityScore,
        deliveryScore: gq.deliveryScore,
        complianceScore: gq.complianceScore,
        aiPros: gq.aiPros,
        aiCons: gq.aiCons,
        negotiationStatus: 'not_started',
        status: i === 0 ? 'selected' : 'active',
      });
      savedQuotes.push(qDoc);
    }

    await createEvent(
      'Quote Agent',
      'quote',
      `Received & Analyzed ${savedQuotes.length} Vendor Quotations`,
      `Constructed multi-factor trade-off matrix across pricing, warranty duration, freight lead time, and ISO quality adherence.`,
      'Layers'
    );

    // Stage 4: Negotiation Strategy Formulation
    procurement.status = 'negotiating';
    procurement.assignedAgentStage = 'Autonomous Negotiation & Margin Analysis';
    procurement.agentProgressPct = 80;
    await procurement.save();

    const topQuote = savedQuotes[0];
    const topVendorDoc = await Vendor.findById(topQuote.vendorId);
    const negPlan = NegotiationAgent.generateNegotiationPlan(
      topQuote.vendorName,
      topQuote.vendorId.toString(),
      procurement.quantity,
      topQuote.totalPrice,
      procurement.category
    );

    await Negotiation.deleteMany({ procurementId: procurement._id });
    const negotiationDoc = await Negotiation.create({
      procurementId: procurement._id,
      quoteId: topQuote._id,
      vendorId: topQuote.vendorId,
      vendorName: topQuote.vendorName,
      companyId: new mongoose.Types.ObjectId(companyId),
      startingPrice: negPlan.startingPrice,
      targetPrice: negPlan.targetPrice,
      suggestedPrompt: negPlan.suggestedPrompt,
      strategyRationale: negPlan.strategyRationale,
      detectedSavingOpportunityPct: negPlan.estimatedSavingPct,
      status: 'pending_human_review',
    });

    await createEvent(
      'Negotiation Agent',
      'negotiation',
      `Identified ${negPlan.estimatedSavingPct}% Bulk Volume Discount Opportunity`,
      `Synthesized negotiation draft for ${topQuote.vendorName}. Formatted strategic prompt with fast PO close incentive for finance manager sign-off.`,
      'TrendingDown',
      { negotiationId: negotiationDoc._id }
    );

    // Stage 5: Recommendation Synthesis & Approval Prep
    const recommendation = RecommendationAgent.synthesizeRecommendation(
      procurement.budget,
      generatedQuotes,
      30
    );

    procurement.status = 'recommended';
    procurement.assignedAgentStage = 'Ready for Human Approval';
    procurement.agentProgressPct = 100;
    procurement.aiRecommendation = {
      vendorId: topQuote.vendorId,
      vendorName: topQuote.vendorName,
      quoteId: topQuote._id,
      finalPrice: topQuote.totalPrice,
      savingsAmount: recommendation.totalSavingsVsBudget,
      savingsPct: recommendation.totalSavingsPct,
      reasoning: recommendation.keyJustificationPillars,
      riskScore: 8,
      summary: recommendation.executiveSummary,
    };
    await procurement.save();

    // Create / Update Approval Card
    await Approval.deleteMany({ procurementId: procurement._id });
    const approvalDoc = await Approval.create({
      procurementId: procurement._id,
      companyId: new mongoose.Types.ObjectId(companyId),
      vendorId: topQuote.vendorId,
      vendorName: topQuote.vendorName,
      quoteId: topQuote._id,
      title: `Purchase Authorization: ${procurement.quantity}x ${procurement.title}`,
      subtotal: topQuote.totalPrice,
      estimatedSavings: recommendation.totalSavingsVsBudget,
      savingsPct: recommendation.totalSavingsPct,
      deliveryDays: topQuote.leadTimeDays,
      justification: recommendation.executiveSummary,
      status: 'pending',
    });

    await createEvent(
      'Recommendation Agent',
      'recommendation',
      `Final Recommendation Prepared: ${topQuote.vendorName}`,
      `Delivers $${recommendation.totalSavingsVsBudget.toLocaleString()} (${recommendation.totalSavingsPct}%) budget savings with a 5-year warranty. Awaiting human purchase authorization.`,
      'Award',
      { approvalId: approvalDoc._id }
    );

    await Notification.create({
      companyId: new mongoose.Types.ObjectId(companyId),
      title: `Procurement Package Ready: ${procurement.title}`,
      message: `AI agent completed vendor discovery and recommended ${topQuote.vendorName} with $${recommendation.totalSavingsVsBudget.toLocaleString()} estimated savings.`,
      type: 'success',
      link: `/procurements/${procurement._id}`,
    });

    return {
      procurement,
      quotes: savedQuotes,
      negotiation: negotiationDoc,
      approval: approvalDoc,
      recommendation,
    };
  }
}
