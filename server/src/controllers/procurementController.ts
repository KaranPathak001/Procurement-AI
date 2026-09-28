import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  ProcurementRequest,
  Quote,
  AgentEvent,
  Negotiation,
  Approval,
  PurchaseOrder,
  AuditLog,
  Notification,
  Vendor,
} from '../models/index.js';
import { RequirementParser } from '../ai/requirementParser.js';
import { ProcurementOrchestrator } from '../ai/procurementAgent.js';

export class ProcurementController {
  // Parse requirement on the fly before creation
  static async parseRequirement(req: Request, res: Response) {
    try {
      const { prompt, overrides } = req.body;
      if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

      const parsed = await RequirementParser.parseFromPrompt(prompt, overrides);
      return res.json({ parsed });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Could not parse requirement' });
    }
  }

  // Create procurement and trigger autonomous cycle
  static async createProcurement(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { prompt, title, category, budget, currency, quantity, deliveryLocation, deadline, priority, specs } = req.body;

      // Extract and normalize
      const parsed = await RequirementParser.parseFromPrompt(prompt || title, {
        title,
        category,
        budget: Number(budget) || 12000,
        currency,
        quantity: Number(quantity) || 50,
        deliveryLocation,
        deadline,
        priority,
      });

      const refCount = await ProcurementRequest.countDocuments({ companyId });
      const refNumber = `PR-${1040 + refCount + 1}`;

      const procurement = await ProcurementRequest.create({
        referenceNumber: refNumber,
        title: parsed.title,
        rawPrompt: prompt || parsed.summary,
        category: parsed.category,
        budget: parsed.budget,
        currency: parsed.currency,
        quantity: parsed.quantity,
        deliveryLocation: parsed.deliveryLocation,
        requiredByDate: parsed.deadline,
        specs: {
          keyRequirements: parsed.keySpecs,
          technicalConstraints: parsed.constraints,
        },
        priority: parsed.priority,
        status: 'understanding',
        companyId: new mongoose.Types.ObjectId(companyId),
        createdBy: new mongoose.Types.ObjectId(userId),
        aiSummary: parsed.summary,
      });

      await AuditLog.create({
        companyId: new mongoose.Types.ObjectId(companyId),
        userId: new mongoose.Types.ObjectId(userId),
        userName: req.user?.name,
        action: 'PROCUREMENT_CREATED',
        entityType: 'procurement',
        entityId: procurement._id.toString(),
        details: { referenceNumber: refNumber, budget: parsed.budget },
      });

      // Run autonomous AI cycle synchronously or asynchronously
      ProcurementOrchestrator.runFullProcurementCycle(
        procurement._id.toString(),
        companyId!,
        userId!
      ).catch((e) => console.error('Agent Orchestrator background error:', e));

      return res.status(201).json({ procurement });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async listProcurements(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const procurements = await ProcurementRequest.find({ companyId })
        .sort({ createdAt: -1 })
        .populate('createdBy', 'name email');

      return res.json({ procurements });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getProcurementById(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const { id } = req.params;

      const procurement = await ProcurementRequest.findOne({ _id: id, companyId });
      if (!procurement) return res.status(404).json({ error: 'Procurement not found' });

      const quotes = await Quote.find({ procurementId: id, companyId }).sort({ overallScore: -1 });
      const events = await AgentEvent.find({ procurementId: id, companyId }).sort({ createdAt: 1 });
      const negotiations = await Negotiation.find({ procurementId: id, companyId });
      const approval = await Approval.findOne({ procurementId: id, companyId });
      const purchaseOrder = await PurchaseOrder.findOne({ procurementId: id, companyId });

      return res.json({
        procurement,
        quotes,
        events,
        negotiations,
        approval,
        purchaseOrder,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async runAgent(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const { id } = req.params;

      const result = await ProcurementOrchestrator.runFullProcurementCycle(id, companyId!, userId!);
      return res.json({ message: 'Agent cycle executed successfully', result });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getEvents(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const { id } = req.params;
      const events = await AgentEvent.find({ procurementId: id, companyId }).sort({ createdAt: 1 });
      return res.json({ events });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
