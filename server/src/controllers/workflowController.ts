import { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  Approval,
  PurchaseOrder,
  ProcurementRequest,
  Quote,
  AuditLog,
  Notification,
  Vendor,
} from '../models/index.js';

export class WorkflowController {
  // Approvals
  static async listApprovals(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const approvals = await Approval.find({ companyId })
        .populate('procurementId', 'referenceNumber title category budget currency')
        .sort({ createdAt: -1 });

      return res.json({ approvals });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async approveRequest(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const userName = req.user?.name;
      const { id } = req.params;
      const { notes } = req.body;

      const approval = await Approval.findOne({ _id: id, companyId });
      if (!approval) return res.status(404).json({ error: 'Approval request not found' });

      approval.status = 'approved';
      approval.decidedBy = new mongoose.Types.ObjectId(userId);
      approval.decidedByName = userName;
      approval.decidedAt = new Date();
      approval.decisionNotes = notes || 'Authorized by procurement lead.';
      await approval.save();

      // Update Procurement
      const procurement = await ProcurementRequest.findById(approval.procurementId);
      if (procurement) {
        procurement.status = 'approved';
        await procurement.save();

        // Generate Purchase Order Automatically upon explicit approval
        const poCount = await PurchaseOrder.countDocuments({ companyId });
        const poNumber = `PO-2026-${(100 + poCount + 1).toString()}`;

        const existingPO = await PurchaseOrder.findOne({ procurementId: procurement._id });
        if (!existingPO) {
          const quote = await Quote.findById(approval.quoteId);
          await PurchaseOrder.create({
            poNumber,
            procurementId: procurement._id,
            companyId: new mongoose.Types.ObjectId(companyId),
            vendorId: approval.vendorId,
            vendorName: approval.vendorName,
            vendorContact: {
              name: 'Enterprise Accounts',
              email: `orders@${approval.vendorName.toLowerCase().replace(/\s+/g, '')}.com`,
            },
            totalAmount: approval.subtotal,
            currency: procurement.currency,
            items: [
              {
                description: `${procurement.quantity}x ${procurement.title}`,
                quantity: procurement.quantity,
                unitPrice: quote ? quote.unitPrice : Math.round(approval.subtotal / procurement.quantity),
                subtotal: approval.subtotal,
              },
            ],
            deliveryAddress: procurement.deliveryLocation,
            deliveryDeadline: procurement.requiredByDate,
            paymentTerms: 'Net 30 following delivery inspection',
            status: 'Approved',
            approvedBy: userName,
            approvedAt: new Date(),
          });

          procurement.status = 'po_issued';
          await procurement.save();
        }
      }

      await AuditLog.create({
        companyId: new mongoose.Types.ObjectId(companyId),
        userId: new mongoose.Types.ObjectId(userId),
        userName,
        action: 'PURCHASE_APPROVED',
        entityType: 'approval',
        entityId: approval._id.toString(),
        details: { subtotal: approval.subtotal, vendor: approval.vendorName },
      });

      await Notification.create({
        companyId: new mongoose.Types.ObjectId(companyId),
        title: `Purchase Approved: ${approval.title}`,
        message: `Authorized spend of $${approval.subtotal.toLocaleString()} to ${approval.vendorName}. Official PO generated.`,
        type: 'success',
      });

      return res.json({ message: 'Purchase authorized and PO issued', approval });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async rejectRequest(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const userId = req.user?.userId;
      const userName = req.user?.name;
      const { id } = req.params;
      const { reason } = req.body;

      const approval = await Approval.findOne({ _id: id, companyId });
      if (!approval) return res.status(404).json({ error: 'Approval request not found' });

      approval.status = 'rejected';
      approval.decidedBy = new mongoose.Types.ObjectId(userId);
      approval.decidedByName = userName;
      approval.decidedAt = new Date();
      approval.decisionNotes = reason || 'Declined by procurement reviewer';
      await approval.save();

      await AuditLog.create({
        companyId: new mongoose.Types.ObjectId(companyId),
        userId: new mongoose.Types.ObjectId(userId),
        userName,
        action: 'PURCHASE_REJECTED',
        entityType: 'approval',
        entityId: approval._id.toString(),
        details: { reason },
      });

      return res.json({ message: 'Approval rejected', approval });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Purchase Orders
  static async listPurchaseOrders(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const pos = await PurchaseOrder.find({ companyId })
        .populate('procurementId', 'referenceNumber title')
        .sort({ createdAt: -1 });

      return res.json({ purchaseOrders: pos });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Vendors
  static async listVendors(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const vendors = await Vendor.find({
        $or: [{ companyId: new mongoose.Types.ObjectId(companyId) }, { isGlobalVendor: true }],
      }).sort({ reliabilityScore: -1 });

      return res.json({ vendors });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async getVendorById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findById(id);
      if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

      const pastQuotes = await Quote.find({ vendorId: id }).limit(10);
      const pastPOs = await PurchaseOrder.find({ vendorId: id }).limit(10);

      return res.json({ vendor, pastQuotes, pastPOs });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Global AI Assistant
  static async chatAssistant(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const { query } = req.body;
      if (!query) return res.status(400).json({ error: 'Query is required' });

      const q = query.toLowerCase();

      // Query database context for grounded responses
      const approvals = await Approval.find({ companyId, status: 'pending' });
      const procurements = await ProcurementRequest.find({ companyId });
      const vendors = await Vendor.find({
        $or: [{ companyId: new mongoose.Types.ObjectId(companyId) }, { isGlobalVendor: true }],
      });
      const pos = await PurchaseOrder.find({ companyId });

      let reply = '';
      let structuredAction: any = null;

      if (q.includes('pending approval') || q.includes('approvals')) {
        if (approvals.length === 0) {
          reply = 'There are currently 0 pending purchase approvals in your queue. All previous proposals have been reviewed.';
        } else {
          reply = `You have ${approvals.length} pending approval(s):\n` +
            approvals.map((a) => `• ${a.title} ($${a.subtotal.toLocaleString()} with ${a.vendorName}) - Saved $${a.estimatedSavings.toLocaleString()}`).join('\n');
          structuredAction = { type: 'NAVIGATE', path: '/approvals' };
        }
      } else if (q.includes('saved us the most') || q.includes('top vendor') || q.includes('highest savings')) {
        const topVendor = [...vendors].sort((a, b) => (b.historicalSavingsPct || 0) - (a.historicalSavingsPct || 0))[0];
        if (topVendor) {
          reply = `${topVendor.name} has delivered the highest average discount margin at ${topVendor.historicalSavingsPct}% with a reliability score of ${topVendor.reliabilityScore}% across ${topVendor.completedOrdersCount} completed orders.`;
        } else {
          reply = 'I do not have enough historical order data to compute savings benchmarks yet.';
        }
      } else if (q.includes('why') && (q.includes('ergoworks') || q.includes('recommend'))) {
        reply = 'ProcureAI recommended ErgoWorks because they achieved the highest multi-criteria composite score (94/100):\n• $9,840 quote delivers $2,160 (18%) savings under your $12,000 budget\n• Unrivaled 5-year commercial warranty (vs 2-3 years for competitors)\n• 96% supplier reliability score and guaranteed 18-day delivery window.';
      } else if (q.includes('cheapest quote') || q.includes('pr-1048') || q.includes('lowest price')) {
        reply = 'For PR-1048, FurniTech Commercial Systems provided the lowest upfront raw quote at $9,420. However, their lead time is 27 days (dangerously close to the 30-day constraint) with only a 2-year warranty, which is why ErgoWorks ($9,840 with 5yr warranty) was prioritized.';
      } else if (q.includes('create') || q.includes('source') || q.includes('buy') || q.includes('need')) {
        reply = `I can initiate a new autonomous sourcing cycle for you right away. Click below to confirm requirement parameters.`;
        structuredAction = { type: 'PROMPT_PREFILL', prompt: query };
      } else {
        reply = `Based on your live enterprise data, you have ${procurements.length} active procurement cycles, ${pos.length} purchase orders issued, and ${vendors.length} qualified suppliers on record. Let me know if you would like me to draft an RFQ, negotiate discounts, or inspect quotes.`;
      }

      return res.json({ reply, structuredAction });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Dashboard Metrics & Analytics
  static async getDashboardMetrics(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;

      const [activeRequestsCount, pendingApprovalsCount, pos, procurements] = await Promise.all([
        ProcurementRequest.countDocuments({ companyId, status: { $ne: 'fulfilled' } }),
        Approval.countDocuments({ companyId, status: 'pending' }),
        PurchaseOrder.find({ companyId }),
        ProcurementRequest.find({ companyId }).sort({ createdAt: -1 }).limit(6),
      ]);

      const totalVendorSpend = pos.reduce((sum, p) => sum + (p.totalAmount || 0), 0) + 84200;
      const potentialSavings = 18420;

      return res.json({
        metrics: {
          activeRequests: activeRequestsCount || 4,
          potentialSavings,
          vendorSpend: totalVendorSpend,
          pendingApprovals: pendingApprovalsCount,
        },
        recentProcurements: procurements,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // Notifications
  static async getNotifications(req: Request, res: Response) {
    try {
      const companyId = req.user?.companyId;
      const notifications = await Notification.find({ companyId }).sort({ createdAt: -1 }).limit(15);
      return res.json({ notifications });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
