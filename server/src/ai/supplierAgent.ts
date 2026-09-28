import { IVendor } from '../models/index.js';

export interface SupplierMatchResult {
  vendor: {
    _id: string;
    name: string;
    categories: string[];
    reliabilityScore: number;
    qualityScore: number;
    pricingCompetitivenessScore: number;
    averageDeliveryDays: number;
    location: string;
    verifiedSupplier: boolean;
    tier: string;
    historicalSavingsPct: number;
  };
  matchScore: number;
  matchReasons: string[];
  rfqStatus: 'sent' | 'responded' | 'declined';
  estimatedLeadTime: string;
}

export class SupplierDiscoveryAgent {
  static async discoverAndRankSuppliers(
    category: string,
    location: string,
    quantity: number,
    existingVendors: any[]
  ): Promise<SupplierMatchResult[]> {
    // If no vendors in DB, provide realistic seed pool
    const vendorPool = existingVendors.length > 0 ? existingVendors : this.getDefaultVendorCatalog();

    const ranked: SupplierMatchResult[] = vendorPool.map((v) => {
      let matchScore = 75;
      const matchReasons: string[] = [];

      // Category match
      const hasCat = v.categories?.some((c: string) => 
        category.toLowerCase().includes(c.toLowerCase()) || c.toLowerCase().includes(category.toLowerCase())
      );
      if (hasCat) {
        matchScore += 15;
        matchReasons.push(`Direct catalog match for ${category}`);
      } else {
        matchReasons.push('Broad enterprise equipment supplier');
      }

      // Location match
      if (v.location?.toLowerCase().includes(location.toLowerCase()) || v.location?.includes('Global')) {
        matchScore += 5;
        matchReasons.push(`Active distribution hub near ${location}`);
      }

      // Reliability & Historical savings
      if (v.reliabilityScore >= 90) {
        matchScore += 5;
        matchReasons.push(`High reliability index (${v.reliabilityScore}%)`);
      }
      if (v.historicalSavingsPct >= 8) {
        matchReasons.push(`Average historical volume discount: ${v.historicalSavingsPct}%`);
      }

      return {
        vendor: {
          _id: v._id?.toString() || Math.random().toString(36).substring(2, 9),
          name: v.name,
          categories: v.categories || ['Enterprise Supplies'],
          reliabilityScore: v.reliabilityScore || 92,
          qualityScore: v.qualityScore || 90,
          pricingCompetitivenessScore: v.pricingCompetitivenessScore || 88,
          averageDeliveryDays: v.averageDeliveryDays || 14,
          location: v.location || 'Global / Domestic Hub',
          verifiedSupplier: v.verifiedSupplier ?? true,
          tier: v.tier || 'tier_1_preferred',
          historicalSavingsPct: v.historicalSavingsPct || 10,
        },
        matchScore: Math.min(99, matchScore),
        matchReasons,
        rfqStatus: 'responded',
        estimatedLeadTime: `${v.averageDeliveryDays || 14} - ${(v.averageDeliveryDays || 14) + 5} days`,
      };
    });

    return ranked.sort((a, b) => b.matchScore - a.matchScore);
  }

  static getDefaultVendorCatalog() {
    return [
      {
        _id: 'v_ergoworks_1',
        name: 'ErgoWorks Global',
        categories: ['Ergonomic Office Furniture', 'Office & Workspace', 'Commercial Seating'],
        reliabilityScore: 96,
        qualityScore: 95,
        pricingCompetitivenessScore: 91,
        averageDeliveryDays: 16,
        location: 'Delhi NCR Hub / Worldwide',
        verifiedSupplier: true,
        tier: 'tier_1_preferred',
        historicalSavingsPct: 12.4,
      },
      {
        _id: 'v_officepro_2',
        name: 'OfficePro Direct Solutions',
        categories: ['Ergonomic Office Furniture', 'IT Hardware & Workstations', 'Office Supplies'],
        reliabilityScore: 92,
        qualityScore: 90,
        pricingCompetitivenessScore: 89,
        averageDeliveryDays: 14,
        location: 'Mumbai & Delhi Hub',
        verifiedSupplier: true,
        tier: 'tier_1_preferred',
        historicalSavingsPct: 9.8,
      },
      {
        _id: 'v_furnitech_3',
        name: 'FurniTech Commercial Systems',
        categories: ['Ergonomic Office Furniture', 'Custom Office Interior'],
        reliabilityScore: 88,
        qualityScore: 89,
        pricingCompetitivenessScore: 94,
        averageDeliveryDays: 24,
        location: 'Bangalore & Chennai Hub',
        verifiedSupplier: true,
        tier: 'tier_2_qualified',
        historicalSavingsPct: 14.5,
      },
      {
        _id: 'v_techsource_4',
        name: 'TechSource Enterprise Logistics',
        categories: ['IT Hardware & Workstations', 'Data Infrastructure & Servers'],
        reliabilityScore: 98,
        qualityScore: 97,
        pricingCompetitivenessScore: 90,
        averageDeliveryDays: 10,
        location: 'Global Distribution Network',
        verifiedSupplier: true,
        tier: 'tier_1_preferred',
        historicalSavingsPct: 11.2,
      },
      {
        _id: 'v_packpro_5',
        name: 'PackPro Sustainable Cartons',
        categories: ['Packaging & Logistics', 'Eco-friendly Materials'],
        reliabilityScore: 94,
        qualityScore: 93,
        pricingCompetitivenessScore: 95,
        averageDeliveryDays: 12,
        location: 'Delhi NCR Industrial Corridor',
        verifiedSupplier: true,
        tier: 'tier_1_preferred',
        historicalSavingsPct: 15.0,
      },
    ];
  }
}
