import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  User,
  Company,
  Vendor,
  ProcurementRequest,
  Quote,
  AgentEvent,
  Negotiation,
  Approval,
  PurchaseOrder,
  AuditLog,
  Notification,
} from '../models/index.js';

export async function seedInitialDemoData() {
  console.log('Seeding ProcureAI Enterprise Demo Dataset...');

  // 1. Create or Find Acme Technologies Company
  let company = await Company.findOne({ name: 'Acme Technologies' });
  if (!company) {
    company = await Company.create({
      name: 'Acme Technologies',
      industry: 'Enterprise Software & Cloud',
      size: '250-1000',
      preferredCurrency: 'USD',
      procurementLocation: 'Delhi, India / Regional Facilities',
      procurementCategories: [
        'Ergonomic Office Furniture',
        'IT Hardware & Workstations',
        'Packaging & Logistics',
        'Office Pantry & Hospitality',
        'Data Infrastructure & Servers',
      ],
      monthlySpendBudget: 150000,
      settings: {
        autoNegotiate: true,
        maxAutonomousBudget: 50000,
        requireTwoSignersAbove: 100000,
      },
    });
  }

  // 2. Create Demo User: karan@acmetech.com / password123
  let user = await User.findOne({ email: 'karan@acmetech.com' });
  if (!user) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    user = await User.create({
      name: 'Karan Patel',
      email: 'karan@acmetech.com',
      passwordHash,
      role: 'procurement_lead',
      companyId: company._id,
      department: 'Global Strategic Sourcing',
    });
  }

  // 3. Clear existing procurements for fresh interactive demo
  await ProcurementRequest.deleteMany({ companyId: company._id });
  await Quote.deleteMany({ companyId: company._id });
  await AgentEvent.deleteMany({ companyId: company._id });
  await Negotiation.deleteMany({ companyId: company._id });
  await Approval.deleteMany({ companyId: company._id });
  await PurchaseOrder.deleteMany({ companyId: company._id });
  await Vendor.deleteMany({});

  // 4. Create Vendors
  const vendorsData = [
    {
      name: 'ErgoWorks Global',
      categories: ['Ergonomic Office Furniture', 'Office & Workspace', 'Commercial Seating'],
      reliabilityScore: 96,
      qualityScore: 95,
      pricingCompetitivenessScore: 91,
      averageDeliveryDays: 16,
      location: 'Delhi NCR Hub / Worldwide',
      contacts: [{ name: 'Sanjay Verma', email: 'sanjay@ergoworks.com', phone: '+91 98110 44321', designation: 'Enterprise VP' }],
      historicalSavingsPct: 12.4,
      completedOrdersCount: 24,
      totalSpendAmount: 84200,
      verifiedSupplier: true,
      tier: 'tier_1_preferred',
    },
    {
      name: 'OfficePro Direct Solutions',
      categories: ['Ergonomic Office Furniture', 'IT Hardware & Workstations', 'Office Supplies'],
      reliabilityScore: 92,
      qualityScore: 90,
      pricingCompetitivenessScore: 89,
      averageDeliveryDays: 14,
      location: 'Mumbai & Delhi Hub',
      contacts: [{ name: 'Ananya Roy', email: 'ananya@officepro.com', designation: 'Key Accounts Lead' }],
      historicalSavingsPct: 9.8,
      completedOrdersCount: 18,
      totalSpendAmount: 51200,
      verifiedSupplier: true,
      tier: 'tier_1_preferred',
    },
    {
      name: 'FurniTech Commercial Systems',
      categories: ['Ergonomic Office Furniture', 'Custom Office Interior'],
      reliabilityScore: 88,
      qualityScore: 89,
      pricingCompetitivenessScore: 94,
      averageDeliveryDays: 27,
      location: 'Bangalore Hub',
      contacts: [{ name: 'Rahul Sharma', email: 'rahul@furnitech.com', designation: 'Commercial Director' }],
      historicalSavingsPct: 14.5,
      completedOrdersCount: 9,
      totalSpendAmount: 32000,
      verifiedSupplier: true,
      tier: 'tier_2_qualified',
    },
    {
      name: 'TechSource Enterprise Logistics',
      categories: ['IT Hardware & Workstations', 'Data Infrastructure & Servers'],
      reliabilityScore: 98,
      qualityScore: 97,
      pricingCompetitivenessScore: 90,
      averageDeliveryDays: 10,
      location: 'Global Distribution Network',
      contacts: [{ name: 'David Miller', email: 'dmiller@techsource.com', designation: 'APAC Enterprise Director' }],
      historicalSavingsPct: 11.2,
      completedOrdersCount: 35,
      totalSpendAmount: 215000,
      verifiedSupplier: true,
      tier: 'tier_1_preferred',
    },
    {
      name: 'PackPro Sustainable Cartons',
      categories: ['Packaging & Logistics', 'Eco-friendly Materials'],
      reliabilityScore: 94,
      qualityScore: 93,
      pricingCompetitivenessScore: 95,
      averageDeliveryDays: 12,
      location: 'Delhi NCR Industrial Corridor',
      contacts: [{ name: 'Vikram Mehta', email: 'vikram@packpro.in', designation: 'Operations Head' }],
      historicalSavingsPct: 15.0,
      completedOrdersCount: 14,
      totalSpendAmount: 43800,
      verifiedSupplier: true,
      tier: 'tier_1_preferred',
    },
  ];

  const createdVendors: any[] = [];
  for (const vd of vendorsData) {
    const v = await Vendor.create({ ...vd, companyId: company._id });
    createdVendors.push(v);
  }

  const ergoVendor = createdVendors[0];
  const officeProVendor = createdVendors[1];
  const furniVendor = createdVendors[2];
  const techVendor = createdVendors[3];
  const packVendor = createdVendors[4];

  // 5. Create Flagship Master Request: "Ergonomic Chairs" (PR-1048)
  const pr1 = await ProcurementRequest.create({
    referenceNumber: 'PR-1048',
    title: '50x Ergonomic Office Chairs',
    rawPrompt: 'Find 50 ergonomic office chairs under $12,000, delivered to Delhi within 30 days. They should have lumbar support, adjustable height, and arrive within 30 days.',
    category: 'Ergonomic Office Furniture',
    budget: 12000,
    currency: 'USD',
    quantity: 50,
    deliveryLocation: 'Delhi, India',
    requiredByDate: '30 days',
    specs: {
      color: 'Executive Onyx Black',
      warrantyRequiredYears: 5,
      keyRequirements: [
        'Adjustable Ergonomic Lumbar Support',
        'Gas-lift Height Adjustability & 3D Armrests',
        'Breathable High-Durability Mesh Back',
        'Minimum 3-5 Year Commercial Warranty',
      ],
      technicalConstraints: [
        'Strict cap at USD 12,000 all-inclusive',
        'Delivery to Okhla Phase III Facility within 30 days',
        'Must be BIFMA certified',
      ],
    },
    priority: 'high',
    status: 'pending_approval',
    companyId: company._id,
    createdBy: user._id,
    assignedAgentStage: 'Ready for Human Approval',
    agentProgressPct: 100,
    aiSummary: 'Autonomous procurement requirement parsed: Sourcing 50 unit(s) of 50x Ergonomic Office Chairs within USD 12,000 target budget to Delhi, India by 30 days.',
  });

  // Quotes for PR-1048
  const qErgo = await Quote.create({
    procurementId: pr1._id,
    vendorId: ergoVendor._id,
    vendorName: ergoVendor.name,
    companyId: company._id,
    unitPrice: 196.8,
    originalPrice: 10700,
    totalPrice: 9840,
    currency: 'USD',
    leadTimeDays: 18,
    warrantyYears: 5,
    overallScore: 94,
    priceScore: 92,
    reliabilityScore: 96,
    deliveryScore: 93,
    complianceScore: 98,
    aiPros: [
      'Strong vendor reliability (96%) with 24 past verified deliveries',
      'Unrivaled 5-year commercial warranty and free replacement on gas-springs',
      'Delivery in 18 days — well inside your 30-day threshold',
      'AI negotiated an 8% volume incentive discount from starting $10,700 quote',
    ],
    aiCons: ['Slightly higher raw base price than lowest bidder FurniTech ($9,420)'],
    negotiationStatus: 'conceded',
    discountOfferedPct: 8.0,
    status: 'selected',
  });

  const qOfficePro = await Quote.create({
    procurementId: pr1._id,
    vendorId: officeProVendor._id,
    vendorName: officeProVendor.name,
    companyId: company._id,
    unitPrice: 205,
    originalPrice: 11000,
    totalPrice: 10250,
    currency: 'USD',
    leadTimeDays: 14,
    warrantyYears: 3,
    overallScore: 91,
    priceScore: 86,
    reliabilityScore: 92,
    deliveryScore: 98,
    complianceScore: 90,
    aiPros: ['Fastest logistics (14 days guaranteed delivery)', 'Includes complimentary assembly team'],
    aiCons: ['Standard 3-year warranty', 'Total price is $410 higher than ErgoWorks'],
    negotiationStatus: 'not_started',
    status: 'active',
  });

  const qFurni = await Quote.create({
    procurementId: pr1._id,
    vendorId: furniVendor._id,
    vendorName: furniVendor.name,
    companyId: company._id,
    unitPrice: 188.4,
    originalPrice: 10200,
    totalPrice: 9420,
    currency: 'USD',
    leadTimeDays: 27,
    warrantyYears: 2,
    overallScore: 86,
    priceScore: 96,
    reliabilityScore: 88,
    deliveryScore: 74,
    complianceScore: 82,
    aiPros: ['Lowest upfront quotation ($9,420 total)', 'High raw price competitiveness'],
    aiCons: ['27 days delivery is close to 30-day deadline', 'Base warranty limited to 2 years'],
    negotiationStatus: 'not_started',
    status: 'active',
  });

  // Events for PR-1048
  const events = [
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Requirement Understanding',
      eventType: 'requirement',
      title: 'Requirement Understood & Structured',
      detail: 'Parsed 50 ergonomic chairs with lumbar support and 30-day delivery deadline at $12,000 budget ceiling.',
      timestamp: '09:41',
      iconType: 'Brain',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Supplier Discovery',
      eventType: 'discovery',
      title: 'Found 14 Relevant Enterprise Suppliers',
      detail: 'Filtered qualified suppliers in Delhi NCR and global hubs matching BIFMA commercial durability standards.',
      timestamp: '09:42',
      iconType: 'Search',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'RFQ Dispatch',
      eventType: 'rfq',
      title: 'Sent RFQ Packages to 14 Suppliers',
      detail: 'Automated RFQ packages with CAD specs, warranty criteria, and mandatory delivery windows sent via vendor portals.',
      timestamp: '09:43',
      iconType: 'Send',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Quote Matrix',
      eventType: 'quote',
      title: 'Received & Evaluated 6 Formal Quotations',
      detail: 'Ingested raw quote documents and constructed weighted decision trade-off matrix.',
      timestamp: '09:48',
      iconType: 'Layers',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Negotiation Engine',
      eventType: 'negotiation',
      title: 'Identified 8% Volume Negotiation Opportunity',
      detail: 'Triggered tactical bulk volume discount request with ErgoWorks Global targeting immediate PO release.',
      timestamp: '09:49',
      iconType: 'TrendingDown',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Supplier Intelligence',
      eventType: 'negotiation',
      title: 'ErgoWorks Conceded to $9,840 (8.04% Discount)',
      detail: 'Vendor agreed to adjust quote from $10,700 to $9,840 while maintaining the 5-year warranty covenant.',
      timestamp: '09:50',
      iconType: 'CheckCircle2',
    },
    {
      procurementId: pr1._id,
      companyId: company._id,
      stage: 'Recommendation Synthesis',
      eventType: 'recommendation',
      title: 'Recommendation Synthesized: ErgoWorks Global',
      detail: 'Saved $2,160 (18.0%) against $12,000 budget. Prepared purchase authorization for human sign-off.',
      timestamp: '09:51',
      iconType: 'Award',
    },
  ];

  for (const ev of events) {
    await AgentEvent.create(ev);
  }

  // Update AI recommendation in PR-1048
  pr1.aiRecommendation = {
    vendorId: ergoVendor._id,
    vendorName: ergoVendor.name,
    quoteId: qErgo._id,
    finalPrice: 9840,
    savingsAmount: 2160,
    savingsPct: 18.0,
    reasoning: [
      'Strong vendor reliability (96%) with 24 previous flawless orders',
      '5-year commercial replacement warranty',
      'Delivery in 18 days (comfortably ahead of 30-day requirement)',
      'Autonomous negotiation yielded $860 extra reduction',
    ],
    riskScore: 6,
    summary: 'ErgoWorks is the optimal choice balancing superior 5-year warranty, proven SLA compliance, and $2,160 in direct budget savings.',
  };
  await pr1.save();

  // Negotiation Card
  await Negotiation.create({
    procurementId: pr1._id,
    quoteId: qErgo._id,
    vendorId: ergoVendor._id,
    vendorName: ergoVendor.name,
    companyId: company._id,
    startingPrice: 10700,
    targetPrice: 9840,
    agreedPrice: 9840,
    suggestedPrompt: 'We are evaluating multiple suppliers for 50 chairs. If you can lock in $9,840 (8% discount), our finance committee can issue the Purchase Order immediately.',
    actualSentMessage: 'We are evaluating multiple suppliers for 50 chairs. If you can lock in $9,840 (8% discount), our finance committee can issue the Purchase Order immediately.',
    vendorResponse: 'Accepted. We have revised the commercial invoice to $9,840 with full 5-year warranty.',
    status: 'accepted',
    detectedSavingOpportunityPct: 8.0,
    strategyRationale: 'High leverage order volume incentive with fast close guarantee.',
  });

  // Approval Item for PR-1048
  await Approval.create({
    procurementId: pr1._id,
    companyId: company._id,
    vendorId: ergoVendor._id,
    vendorName: ergoVendor.name,
    quoteId: qErgo._id,
    title: 'Purchase Authorization: 50x Ergonomic Office Chairs',
    subtotal: 9840,
    estimatedSavings: 2160,
    savingsPct: 18.0,
    deliveryDays: 18,
    justification: 'ErgoWorks recommended with 5-year warranty, 18-day delivery, and $2,160 budget surplus.',
    status: 'pending',
  });

  // 6. Create Additional Demo Procurements
  // PR-1049: MacBook Pro Fleet
  const pr2 = await ProcurementRequest.create({
    referenceNumber: 'PR-1049',
    title: '30x MacBook Pro 16" M3 Max',
    rawPrompt: 'Need 30 M3 Max MacBook Pros for the engineering team. Budget $110,000. 15-day delivery.',
    category: 'IT Hardware & Workstations',
    budget: 110000,
    currency: 'USD',
    quantity: 30,
    deliveryLocation: 'San Francisco & Delhi Hub',
    requiredByDate: '15 days',
    specs: {
      keyRequirements: ['Apple M3 Max 16-Core', '64GB Unified RAM', '1TB NVMe Storage', 'AppleCare+ for Enterprise'],
      technicalConstraints: ['Authorized Apple Enterprise Partner only'],
    },
    priority: 'urgent',
    status: 'po_issued',
    companyId: company._id,
    createdBy: user._id,
    assignedAgentStage: 'Purchase Order Issued to TechSource',
    agentProgressPct: 100,
    aiSummary: 'Autonomous procurement of 30x M3 Max units at $96,400 with 3-year AppleCare+ enterprise support.',
    aiRecommendation: {
      vendorId: techVendor._id,
      vendorName: techVendor.name,
      finalPrice: 96400,
      savingsAmount: 13600,
      savingsPct: 12.3,
      reasoning: ['Direct Tier-1 Apple distributor', '10-day expedited air freight'],
      riskScore: 3,
      summary: 'TechSource selected with $13,600 volume discount and 10-day priority delivery.',
    },
  });

  // Purchase Order for PR-1049
  await PurchaseOrder.create({
    poNumber: 'PO-2026-1049',
    procurementId: pr2._id,
    companyId: company._id,
    vendorId: techVendor._id,
    vendorName: techVendor.name,
    vendorContact: { name: 'David Miller', email: 'dmiller@techsource.com' },
    totalAmount: 96400,
    currency: 'USD',
    items: [{ description: '30x Apple MacBook Pro 16" (M3 Max / 64GB / 1TB)', quantity: 30, unitPrice: 3213.33, subtotal: 96400 }],
    deliveryAddress: 'Tech Park Central, Sector 62, Noida / Delhi NCR',
    deliveryDeadline: '10 business days',
    paymentTerms: 'Net 30 with hardware verification',
    status: 'Acknowledged',
    approvedBy: 'Karan Patel',
    approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  });

  // PR-1050: Packaging Supplies
  await ProcurementRequest.create({
    referenceNumber: 'PR-1050',
    title: '5,000x Custom Recycled Shipping Boxes',
    rawPrompt: '5,000 custom branded corrugated boxes, FSC certified, 100% biodegradable.',
    category: 'Packaging & Logistics',
    budget: 8500,
    currency: 'USD',
    quantity: 5000,
    deliveryLocation: 'Delhi Industrial Warehouse',
    requiredByDate: '20 days',
    specs: {
      keyRequirements: ['Double-wall 200lb Burst Test', 'Soy-based eco ink printing', 'FSC Recycled'],
    },
    priority: 'medium',
    status: 'negotiating',
    companyId: company._id,
    createdBy: user._id,
    assignedAgentStage: 'Negotiating Bulk Margin with PackPro',
    agentProgressPct: 75,
    aiSummary: 'Autonomous procurement of 5,000 custom cartons. PackPro quote $6,900 undergoing 7% rebate negotiation.',
  });

  // PR-1051: Office Pantry
  await ProcurementRequest.create({
    referenceNumber: 'PR-1051',
    title: 'Quarterly Premium Coffee & Pantry Replenishment',
    rawPrompt: 'Quarterly supply of organic whole bean roast coffee, oat milk, and health snack packs for 350 staff.',
    category: 'Office Pantry & Hospitality',
    budget: 4500,
    currency: 'USD',
    quantity: 1,
    deliveryLocation: 'Headquarters Main Kitchen',
    requiredByDate: '7 days',
    specs: {
      keyRequirements: ['Weekly automatic batch delivery', 'Organic certified'],
    },
    priority: 'medium',
    status: 'recommended',
    companyId: company._id,
    createdBy: user._id,
    assignedAgentStage: 'Vendor Quotes Synthesized',
    agentProgressPct: 90,
    aiSummary: 'Automated procurement of pantry supplies across 4 local roasters.',
  });

  // 7. Initial Notifications
  await Notification.create({
    companyId: company._id,
    title: '6 New Quotations Ingested for PR-1048',
    message: 'AI agent evaluated quotes from ErgoWorks, OfficePro, FurniTech and ranked top recommendations.',
    type: 'info',
    link: `/procurements/${pr1._id}`,
  });

  await Notification.create({
    companyId: company._id,
    title: 'Purchase Requires Your Approval',
    message: '50x Ergonomic Office Chairs ($9,840 subtotal, $2,160 estimated savings) is awaiting your final sign-off.',
    type: 'alert',
    link: '/approvals',
  });

  console.log('ProcureAI Demo Dataset successfully seeded!');
  return {
    user: { email: user.email, password: 'password123' },
    company: company.name,
    procurementCount: 4,
  };
}
