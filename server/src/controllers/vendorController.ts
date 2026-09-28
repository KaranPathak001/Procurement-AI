import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Vendor, Product, RFQ, Quote, PurchaseOrder, ProcurementRequest } from '../models/index.js';

export class VendorController {
  // ─── GET /vendor/profile ────────────────────────────────────────────────────
  static async getMyProfile(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const vendor = await Vendor.findById(vendorId);
      if (!vendor) return res.status(404).json({ error: 'Vendor profile not found.' });

      return res.json({ vendor });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── PATCH /vendor/profile ───────────────────────────────────────────────────
  static async updateProfile(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const {
        name, location, description, website, phone,
        categories, minOrderQuantity, averageDeliveryDays,
      } = req.body;

      const vendor = await Vendor.findByIdAndUpdate(
        vendorId,
        {
          $set: {
            ...(name && { name }),
            ...(location && { location }),
            ...(description !== undefined && { description }),
            ...(website !== undefined && { website }),
            ...(phone !== undefined && { phone }),
            ...(categories && categories.length > 0 && { categories }),
            ...(minOrderQuantity && { minOrderQuantity: Number(minOrderQuantity) }),
            ...(averageDeliveryDays && { averageDeliveryDays: Number(averageDeliveryDays) }),
          },
        },
        { new: true }
      );

      return res.json({ message: 'Vendor profile updated', vendor });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendor/products ────────────────────────────────────────────────────
  static async listMyProducts(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const products = await Product.find({ vendorId }).sort({ createdAt: -1 });
      return res.json({ products });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── POST /vendor/products ───────────────────────────────────────────────────
  static async createProduct(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const { name, description, category, unit, basePrice, currency, minimumOrderQuantity, deliveryDays, warranty, availability } = req.body;

      if (!name || !category || !basePrice) {
        return res.status(400).json({ error: 'Product name, category, and base price are required.' });
      }

      const product = await Product.create({
        vendorId: new mongoose.Types.ObjectId(vendorId),
        name,
        description: description || '',
        category,
        unit: unit || 'unit',
        basePrice: Number(basePrice),
        currency: currency || 'INR',
        minimumOrderQuantity: Number(minimumOrderQuantity) || 1,
        deliveryDays: Number(deliveryDays) || 14,
        warranty: warranty || '1 year standard',
        availability: availability || 'in_stock',
      });

      return res.status(201).json({ product });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── PATCH /vendor/products/:productId ──────────────────────────────────────
  static async updateProduct(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const { productId } = req.params;
      const product = await Product.findOne({ _id: productId, vendorId });
      if (!product) return res.status(404).json({ error: 'Product not found or not owned by this vendor.' });

      const { name, description, category, unit, basePrice, currency, minimumOrderQuantity, deliveryDays, warranty, availability } = req.body;

      Object.assign(product, {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(category && { category }),
        ...(unit && { unit }),
        ...(basePrice && { basePrice: Number(basePrice) }),
        ...(currency && { currency }),
        ...(minimumOrderQuantity && { minimumOrderQuantity: Number(minimumOrderQuantity) }),
        ...(deliveryDays && { deliveryDays: Number(deliveryDays) }),
        ...(warranty !== undefined && { warranty }),
        ...(availability && { availability }),
      });

      await product.save();
      return res.json({ product });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── DELETE /vendor/products/:productId ─────────────────────────────────────
  static async deleteProduct(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const { productId } = req.params;
      const product = await Product.findOneAndDelete({ _id: productId, vendorId });
      if (!product) return res.status(404).json({ error: 'Product not found.' });

      return res.json({ message: 'Product deleted successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendor/rfqs ────────────────────────────────────────────────────────
  static async listMyRFQs(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const rfqs = await RFQ.find({ vendorId })
        .populate('procurementRequestId', 'title referenceNumber category quantity budget currency deliveryLocation requiredByDate specs')
        .populate('companyId', 'name industry')
        .sort({ createdAt: -1 });

      return res.json({ rfqs });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── POST /vendor/rfqs/:rfqId/quote ─────────────────────────────────────────
  static async submitQuote(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const { rfqId } = req.params;
      const rfq = await RFQ.findOne({ _id: rfqId, vendorId });
      if (!rfq) return res.status(404).json({ error: 'RFQ not found or not assigned to your vendor account.' });

      if (rfq.status === 'quoted') {
        return res.status(400).json({ error: 'A quote has already been submitted for this RFQ.' });
      }

      const { unitPrice, totalPrice, deliveryDays, warrantyYears, notes, currency } = req.body;

      if (!unitPrice || !totalPrice || !deliveryDays) {
        return res.status(400).json({ error: 'Unit price, total price, and delivery days are required.' });
      }

      const vendor = await Vendor.findById(vendorId);

      const quote = await Quote.create({
        procurementId: rfq.procurementRequestId,
        vendorId: new mongoose.Types.ObjectId(vendorId),
        vendorName: vendor?.name || 'Vendor',
        companyId: rfq.companyId,
        unitPrice: Number(unitPrice),
        totalPrice: Number(totalPrice),
        originalPrice: Number(totalPrice),
        currency: currency || 'INR',
        leadTimeDays: Number(deliveryDays),
        warrantyYears: Number(warrantyYears) || 1,
        overallScore: 85,
        priceScore: 85,
        reliabilityScore: vendor?.reliabilityScore || 90,
        deliveryScore: 85,
        complianceScore: 95,
        aiPros: notes ? [notes] : [`${vendor?.name} submitted a competitive quote`],
        aiCons: [],
        negotiationStatus: 'not_started',
        status: 'active',
      });

      // Update RFQ status
      rfq.status = 'quoted';
      rfq.quoteId = quote._id as mongoose.Types.ObjectId;
      await rfq.save();

      // Update procurement status to quotes_received if not already advanced
      await ProcurementRequest.findOneAndUpdate(
        { _id: rfq.procurementRequestId, status: { $in: ['rfq_sent', 'understanding', 'supplier_discovery'] } },
        { $set: { status: 'quotes_received', assignedAgentStage: 'Collecting & Analyzing Quotations', agentProgressPct: 60 } }
      );

      return res.status(201).json({ quote, message: 'Quote submitted successfully.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendor/quotes ──────────────────────────────────────────────────────
  static async listMyQuotes(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const quotes = await Quote.find({ vendorId })
        .populate('procurementId', 'referenceNumber title category budget quantity deliveryLocation status')
        .populate('companyId', 'name')
        .sort({ createdAt: -1 });

      return res.json({ quotes });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendor/orders ──────────────────────────────────────────────────────
  static async listMyOrders(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const orders = await PurchaseOrder.find({ vendorId })
        .populate('procurementId', 'referenceNumber title')
        .populate('companyId', 'name')
        .sort({ createdAt: -1 });

      return res.json({ orders });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendor/dashboard ───────────────────────────────────────────────────
  static async getDashboard(req: Request, res: Response) {
    try {
      const vendorId = req.user?.vendorId;
      if (!vendorId) return res.status(403).json({ error: 'Vendor account required.' });

      const [rfqCount, activeQuotes, acceptedQuotes, orders, products] = await Promise.all([
        RFQ.countDocuments({ vendorId, status: { $in: ['sent', 'viewed'] } }),
        Quote.countDocuments({ vendorId, status: 'active' }),
        Quote.countDocuments({ vendorId, status: 'selected' }),
        PurchaseOrder.find({ vendorId }).sort({ createdAt: -1 }).limit(5),
        Product.countDocuments({ vendorId }),
      ]);

      const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

      return res.json({
        metrics: {
          pendingRFQs: rfqCount,
          activeQuotes,
          acceptedQuotes,
          totalOrders: orders.length,
          totalRevenue,
          productsListed: products,
        },
        recentOrders: orders,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendors (public buyer directory) ───────────────────────────────────
  static async listPublicVendors(req: Request, res: Response) {
    try {
      const { search, category, location } = req.query as Record<string, string>;

      const filter: any = {};
      if (search) filter.name = { $regex: search, $options: 'i' };
      if (category) filter.categories = { $regex: category, $options: 'i' };
      if (location) filter.location = { $regex: location, $options: 'i' };

      const vendors = await Vendor.find(filter).sort({ reliabilityScore: -1 });
      return res.json({ vendors });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // ─── GET /vendors/:id ────────────────────────────────────────────────────────
  static async getVendorPublicProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vendor = await Vendor.findById(id);
      if (!vendor) return res.status(404).json({ error: 'Vendor not found' });

      const products = await Product.find({ vendorId: id, availability: { $ne: 'out_of_stock' } });

      return res.json({ vendor, products });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
