import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'buyer' | 'vendor' | 'admin' | 'procurement_lead' | 'finance_approver';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: UserRole;
  companyId?: mongoose.Types.ObjectId;
  vendorId?: mongoose.Types.ObjectId;
  department?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['buyer', 'vendor', 'admin', 'procurement_lead', 'finance_approver'],
      default: 'buyer',
    },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
    department: { type: String, default: 'Procurement' },
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);

export interface ICompany extends Document {
  name: string;
  industry: string;
  size: string;
  preferredCurrency: string;
  procurementLocation: string;
  procurementCategories: string[];
  monthlySpendBudget: number;
  settings: {
    autoNegotiate: boolean;
    maxAutonomousBudget: number;
    requireTwoSignersAbove: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true },
    industry: { type: String, default: 'Technology & Enterprise' },
    size: { type: String, default: '50-250' },
    preferredCurrency: { type: String, default: 'USD' },
    procurementLocation: { type: String, default: 'Delhi, India / Global' },
    procurementCategories: [{ type: String }],
    monthlySpendBudget: { type: Number, default: 50000 },
    settings: {
      autoNegotiate: { type: Boolean, default: true },
      maxAutonomousBudget: { type: Number, default: 25000 },
      requireTwoSignersAbove: { type: Number, default: 100000 },
    },
  },
  { timestamps: true }
);

export const Company = mongoose.model<ICompany>('Company', CompanySchema);

export interface IVendorContact {
  name: string;
  email: string;
  phone?: string;
  designation?: string;
}

export interface IVendor extends Document {
  name: string;
  userId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  isGlobalVendor: boolean;
  categories: string[];
  reliabilityScore: number;
  qualityScore: number;
  averageDeliveryDays: number;
  pricingCompetitivenessScore: number;
  location: string;
  description?: string;
  website?: string;
  phone?: string;
  minOrderQuantity?: number;
  contacts: IVendorContact[];
  historicalSavingsPct: number;
  completedOrdersCount: number;
  totalSpendAmount: number;
  tags: string[];
  verifiedSupplier: boolean;
  tier: 'tier_1_preferred' | 'tier_2_qualified' | 'tier_3_evaluated';
  createdAt: Date;
  updatedAt: Date;
}

const VendorSchema = new Schema<IVendor>(
  {
    name: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    isGlobalVendor: { type: Boolean, default: false },
    categories: [{ type: String }],
    reliabilityScore: { type: Number, min: 0, max: 100, default: 90 },
    qualityScore: { type: Number, min: 0, max: 100, default: 92 },
    averageDeliveryDays: { type: Number, default: 14 },
    pricingCompetitivenessScore: { type: Number, min: 0, max: 100, default: 88 },
    location: { type: String, default: 'Global / Domestic' },
    description: { type: String, default: '' },
    website: { type: String, default: '' },
    phone: { type: String, default: '' },
    minOrderQuantity: { type: Number, default: 1 },
    contacts: [
      {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: String,
        designation: String,
      },
    ],
    historicalSavingsPct: { type: Number, default: 8.5 },
    completedOrdersCount: { type: Number, default: 0 },
    totalSpendAmount: { type: Number, default: 0 },
    tags: [{ type: String }],
    verifiedSupplier: { type: Boolean, default: true },
    tier: {
      type: String,
      enum: ['tier_1_preferred', 'tier_2_qualified', 'tier_3_evaluated'],
      default: 'tier_2_qualified',
    },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);

export type ProcurementStatus =
  | 'draft'
  | 'understanding'
  | 'supplier_discovery'
  | 'rfq_sent'
  | 'quotes_received'
  | 'negotiating'
  | 'recommended'
  | 'pending_approval'
  | 'approved'
  | 'po_issued'
  | 'fulfilled'
  | 'cancelled';

export interface IProcurementRequest extends Document {
  referenceNumber: string;
  title: string;
  rawPrompt: string;
  category: string;
  budget: number;
  currency: string;
  quantity: number;
  deliveryLocation: string;
  requiredByDate: string;
  specs: {
    color?: string;
    warrantyRequiredYears?: number;
    keyRequirements: string[];
    technicalConstraints?: string[];
  };
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: ProcurementStatus;
  companyId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  assignedAgentStage: string;
  agentProgressPct: number;
  aiSummary: string;
  aiRecommendation?: {
    vendorId: mongoose.Types.ObjectId;
    vendorName: string;
    quoteId: mongoose.Types.ObjectId;
    finalPrice: number;
    savingsAmount: number;
    savingsPct: number;
    reasoning: string[];
    riskScore: number;
    summary: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ProcurementRequestSchema = new Schema<IProcurementRequest>(
  {
    referenceNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    rawPrompt: { type: String, required: true },
    category: { type: String, default: 'General Equipment' },
    budget: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    quantity: { type: Number, required: true, default: 1 },
    deliveryLocation: { type: String, default: 'Delhi, India' },
    requiredByDate: { type: String, default: '30 days' },
    specs: {
      color: String,
      warrantyRequiredYears: Number,
      keyRequirements: [{ type: String }],
      technicalConstraints: [{ type: String }],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'high',
    },
    status: {
      type: String,
      enum: [
        'draft',
        'understanding',
        'supplier_discovery',
        'rfq_sent',
        'quotes_received',
        'negotiating',
        'recommended',
        'pending_approval',
        'approved',
        'po_issued',
        'fulfilled',
        'cancelled',
      ],
      default: 'understanding',
    },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAgentStage: { type: String, default: 'Initiating Autonomous Cycle' },
    agentProgressPct: { type: Number, default: 15 },
    aiSummary: { type: String, default: '' },
    aiRecommendation: {
      vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor' },
      vendorName: String,
      quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
      finalPrice: Number,
      savingsAmount: Number,
      savingsPct: Number,
      reasoning: [{ type: String }],
      riskScore: Number,
      summary: String,
    },
  },
  { timestamps: true }
);

export const ProcurementRequest = mongoose.model<IProcurementRequest>(
  'ProcurementRequest',
  ProcurementRequestSchema
);

export interface IQuote extends Document {
  procurementId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  companyId: mongoose.Types.ObjectId;
  unitPrice: number;
  totalPrice: number;
  originalPrice: number;
  currency: string;
  leadTimeDays: number;
  warrantyYears: number;
  overallScore: number;
  priceScore: number;
  reliabilityScore: number;
  deliveryScore: number;
  complianceScore: number;
  aiPros: string[];
  aiCons: string[];
  negotiationStatus: 'not_started' | 'discount_requested' | 'conceded' | 'counter_accepted' | 'declined';
  discountOfferedPct: number;
  quoteDocumentUrl?: string;
  validUntil: Date;
  status: 'active' | 'selected' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const QuoteSchema = new Schema<IQuote>(
  {
    procurementId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    leadTimeDays: { type: Number, required: true },
    warrantyYears: { type: Number, default: 2 },
    overallScore: { type: Number, min: 0, max: 100, default: 85 },
    priceScore: { type: Number, default: 85 },
    reliabilityScore: { type: Number, default: 90 },
    deliveryScore: { type: Number, default: 85 },
    complianceScore: { type: Number, default: 95 },
    aiPros: [{ type: String }],
    aiCons: [{ type: String }],
    negotiationStatus: {
      type: String,
      enum: ['not_started', 'discount_requested', 'conceded', 'counter_accepted', 'declined'],
      default: 'not_started',
    },
    discountOfferedPct: { type: Number, default: 0 },
    quoteDocumentUrl: String,
    validUntil: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    status: {
      type: String,
      enum: ['active', 'selected', 'rejected'],
      default: 'active',
    },
  },
  { timestamps: true }
);

export const Quote = mongoose.model<IQuote>('Quote', QuoteSchema);

export interface IAgentEvent extends Document {
  procurementId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  stage: string;
  eventType: 'requirement' | 'discovery' | 'rfq' | 'quote' | 'negotiation' | 'recommendation' | 'approval' | 'po';
  title: string;
  detail: string;
  timestamp: string;
  metadata?: Record<string, any>;
  iconType: string;
  createdAt: Date;
}

const AgentEventSchema = new Schema<IAgentEvent>(
  {
    procurementId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    stage: { type: String, required: true },
    eventType: {
      type: String,
      enum: ['requirement', 'discovery', 'rfq', 'quote', 'negotiation', 'recommendation', 'approval', 'po'],
      required: true,
    },
    title: { type: String, required: true },
    detail: { type: String, required: true },
    timestamp: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed },
    iconType: { type: String, default: 'CheckCircle2' },
  },
  { timestamps: true }
);

export const AgentEvent = mongoose.model<IAgentEvent>('AgentEvent', AgentEventSchema);

export interface INegotiation extends Document {
  procurementId: mongoose.Types.ObjectId;
  quoteId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  companyId: mongoose.Types.ObjectId;
  startingPrice: number;
  targetPrice: number;
  agreedPrice?: number;
  suggestedPrompt: string;
  actualSentMessage?: string;
  vendorResponse?: string;
  status: 'pending_human_review' | 'sent' | 'accepted' | 'counter_offered' | 'rejected';
  detectedSavingOpportunityPct: number;
  strategyRationale: string;
  createdAt: Date;
  updatedAt: Date;
}

const NegotiationSchema = new Schema<INegotiation>(
  {
    procurementId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    startingPrice: { type: Number, required: true },
    targetPrice: { type: Number, required: true },
    agreedPrice: Number,
    suggestedPrompt: { type: String, required: true },
    actualSentMessage: String,
    vendorResponse: String,
    status: {
      type: String,
      enum: ['pending_human_review', 'sent', 'accepted', 'counter_offered', 'rejected'],
      default: 'pending_human_review',
    },
    detectedSavingOpportunityPct: { type: Number, default: 8 },
    strategyRationale: { type: String, required: true },
  },
  { timestamps: true }
);

export const Negotiation = mongoose.model<INegotiation>('Negotiation', NegotiationSchema);

export interface IApproval extends Document {
  procurementId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  quoteId: mongoose.Types.ObjectId;
  title: string;
  subtotal: number;
  estimatedSavings: number;
  savingsPct: number;
  deliveryDays: number;
  justification: string;
  status: 'pending' | 'approved' | 'rejected';
  decidedBy?: mongoose.Types.ObjectId;
  decidedByName?: string;
  decidedAt?: Date;
  decisionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApprovalSchema = new Schema<IApproval>(
  {
    procurementId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, required: true },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote', required: true },
    title: { type: String, required: true },
    subtotal: { type: Number, required: true },
    estimatedSavings: { type: Number, required: true },
    savingsPct: { type: Number, required: true },
    deliveryDays: { type: Number, required: true },
    justification: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    decidedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    decidedByName: String,
    decidedAt: Date,
    decisionNotes: String,
  },
  { timestamps: true }
);

export const Approval = mongoose.model<IApproval>('Approval', ApprovalSchema);

export interface IPurchaseOrder extends Document {
  poNumber: string;
  procurementId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  vendorName: string;
  vendorContact: {
    name: string;
    email: string;
  };
  totalAmount: number;
  currency: string;
  items: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
  }>;
  deliveryAddress: string;
  deliveryDeadline: string;
  paymentTerms: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Acknowledged' | 'Completed' | 'Cancelled';
  approvedBy?: string;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchaseOrderSchema = new Schema<IPurchaseOrder>(
  {
    poNumber: { type: String, required: true, unique: true },
    procurementId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    vendorName: { type: String, required: true },
    vendorContact: {
      name: { type: String, default: 'Sales Team' },
      email: { type: String, default: 'sales@vendor.com' },
    },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    items: [
      {
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        subtotal: { type: Number, required: true },
      },
    ],
    deliveryAddress: { type: String, required: true },
    deliveryDeadline: { type: String, required: true },
    paymentTerms: { type: String, default: 'Net 30 upon delivery inspection' },
    status: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Sent', 'Acknowledged', 'Completed', 'Cancelled'],
      default: 'Approved',
    },
    approvedBy: String,
    approvedAt: Date,
  },
  { timestamps: true }
);

export const PurchaseOrder = mongoose.model<IPurchaseOrder>('PurchaseOrder', PurchaseOrderSchema);

export interface IAuditLog extends Document {
  companyId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  userName?: string;
  action: string;
  entityType: 'procurement' | 'approval' | 'purchase_order' | 'negotiation' | 'vendor' | 'auth';
  entityId: string;
  details: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    action: { type: String, required: true },
    entityType: {
      type: String,
      enum: ['procurement', 'approval', 'purchase_order', 'negotiation', 'vendor', 'auth'],
      required: true,
    },
    entityId: { type: String, required: true },
    details: { type: Schema.Types.Mixed },
    ipAddress: String,
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);

export interface INotification extends Document {
  companyId: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['info', 'success', 'warning', 'alert'], default: 'info' },
    link: String,
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);

export interface IProduct extends Document {
  vendorId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  category: string;
  unit: string;
  basePrice: number;
  currency: string;
  minimumOrderQuantity: number;
  deliveryDays: number;
  warranty: string;
  availability: 'in_stock' | 'made_to_order' | 'out_of_stock';
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, required: true },
    unit: { type: String, default: 'unit' },
    basePrice: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    minimumOrderQuantity: { type: Number, default: 1 },
    deliveryDays: { type: Number, default: 14 },
    warranty: { type: String, default: '1 year standard' },
    availability: {
      type: String,
      enum: ['in_stock', 'made_to_order', 'out_of_stock'],
      default: 'in_stock',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

export interface IRFQ extends Document {
  procurementRequestId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  vendorId: mongoose.Types.ObjectId;
  title: string;
  category: string;
  quantity: number;
  budget: number;
  currency: string;
  deliveryLocation: string;
  requiredByDate: string;
  specifications: string[];
  status: 'sent' | 'viewed' | 'quoted' | 'declined' | 'closed';
  sentAt: Date;
  expiresAt: Date;
  quoteId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const RFQSchema = new Schema<IRFQ>(
  {
    procurementRequestId: { type: Schema.Types.ObjectId, ref: 'ProcurementRequest', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    vendorId: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    title: { type: String, required: true },
    category: { type: String, default: 'General' },
    quantity: { type: Number, required: true },
    budget: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    deliveryLocation: { type: String, default: '' },
    requiredByDate: { type: String, default: '' },
    specifications: [{ type: String }],
    status: {
      type: String,
      enum: ['sent', 'viewed', 'quoted', 'declined', 'closed'],
      default: 'sent',
    },
    sentAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) },
    quoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
  },
  { timestamps: true }
);

export const RFQ = mongoose.model<IRFQ>('RFQ', RFQSchema);

