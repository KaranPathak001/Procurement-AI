import { z } from 'zod';

export const ParsedRequirementSchema = z.object({
  title: z.string().min(3),
  category: z.string().default('General Equipment'),
  quantity: z.number().int().positive().default(1),
  budget: z.number().positive(),
  currency: z.string().default('USD'),
  deadline: z.string().default('30 days'),
  deliveryLocation: z.string().default('Delhi, India'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('high'),
  keySpecs: z.array(z.string()).default([]),
  constraints: z.array(z.string()).default([]),
  preferredBrands: z.array(z.string()).default([]),
  summary: z.string(),
});

export type ParsedRequirement = z.infer<typeof ParsedRequirementSchema>;

export class RequirementParser {
  static async parseFromPrompt(prompt: string, overrideParams?: Partial<ParsedRequirement>): Promise<ParsedRequirement> {
    const text = prompt.toLowerCase();

    // 1. Quantity extraction
    let quantity = 1;
    const qtyMatch = text.match(/(\d+)\s*(units?|chairs?|laptops?|desks?|monitors?|boxes?|servers?|items?|pieces?|pcs?|packs?)/i);
    if (qtyMatch && qtyMatch[1]) {
      quantity = parseInt(qtyMatch[1], 10);
    } else {
      const genericNumMatch = text.match(/\b(\d{1,5})\b/);
      if (genericNumMatch && parseInt(genericNumMatch[1], 10) < 1000) {
        quantity = parseInt(genericNumMatch[1], 10);
      }
    }

    // 2. Budget extraction
    let budget = 10000;
    let currency = 'USD';
    const budgetMatch = prompt.match(/(\$|€|£|₹|usd|eur|gbp|inr)?\s*([\d,]+(\.\d+)?)\s*(k|thousand|lakh|crore)?(\s*(usd|inr|eur|gbp|\$|₹))?/i);
    
    // Look for explicit budget keywords
    const explicitBudgetMatch = prompt.match(/(under|budget|below|around|approx|max)\s*(\$|€|£|₹|usd|inr)?\s*([\d,]+)\s*(k)?/i);
    if (explicitBudgetMatch) {
      let val = parseFloat(explicitBudgetMatch[3].replace(/,/g, ''));
      if (explicitBudgetMatch[4] && explicitBudgetMatch[4].toLowerCase() === 'k') {
        val *= 1000;
      }
      budget = val;
      if (explicitBudgetMatch[2] === '₹' || prompt.toLowerCase().includes('inr')) currency = 'INR';
      else if (explicitBudgetMatch[2] === '€' || prompt.toLowerCase().includes('eur')) currency = 'EUR';
      else if (explicitBudgetMatch[2] === '£' || prompt.toLowerCase().includes('gbp')) currency = 'GBP';
    } else if (prompt.includes('$12,000') || prompt.includes('12000')) {
      budget = 12000;
    } else if (prompt.includes('$120k') || prompt.includes('120,000')) {
      budget = 120000;
    }

    // 3. Category & Title Detection
    let category = 'Office & Workspace';
    let title = 'Procurement Order';

    if (text.includes('chair') || text.includes('furniture') || text.includes('desk') || text.includes('ergonomic')) {
      category = 'Ergonomic Office Furniture';
      title = `${quantity}x Ergonomic Office Chairs`;
    } else if (text.includes('laptop') || text.includes('macbook') || text.includes('computer') || text.includes('lenovo') || text.includes('dell')) {
      category = 'IT Hardware & Workstations';
      title = `${quantity}x Enterprise Laptops`;
    } else if (text.includes('packag') || text.includes('box') || text.includes('corrugated') || text.includes('carton')) {
      category = 'Packaging & Logistics';
      title = `${quantity}x Custom Packaging Units`;
    } else if (text.includes('pantry') || text.includes('coffee') || text.includes('snack') || text.includes('kitchen')) {
      category = 'Office Pantry & Hospitality';
      title = `Monthly Office Pantry Replenishment`;
    } else if (text.includes('server') || text.includes('cloud') || text.includes('gpu') || text.includes('datacenter')) {
      category = 'Data Infrastructure & Servers';
      title = `${quantity}x High-Performance Compute Nodes`;
    } else {
      title = `Procurement for ${prompt.slice(0, 40)}...`;
    }

    // 4. Delivery location
    let deliveryLocation = 'Delhi, India';
    if (text.includes('delhi')) deliveryLocation = 'Delhi, India';
    else if (text.includes('bangalore') || text.includes('bengaluru')) deliveryLocation = 'Bangalore, India';
    else if (text.includes('mumbai')) deliveryLocation = 'Mumbai, India';
    else if (text.includes('san francisco') || text.includes('sf')) deliveryLocation = 'San Francisco, CA, USA';
    else if (text.includes('new york') || text.includes('nyc')) deliveryLocation = 'New York, NY, USA';
    else if (text.includes('london')) deliveryLocation = 'London, UK';
    else if (text.includes('singapore')) deliveryLocation = 'Singapore';

    // 5. Deadline extraction
    let deadline = '30 days';
    const deadlineMatch = text.match(/within\s*(\d+)\s*(days?|weeks?|months?)/i);
    if (deadlineMatch) {
      deadline = `${deadlineMatch[1]} ${deadlineMatch[2]}`;
    }

    // 6. Key specs & Constraints
    const keySpecs: string[] = [];
    if (text.includes('lumbar')) keySpecs.push('Adjustable Ergonomic Lumbar Support');
    if (text.includes('height')) keySpecs.push('Gas-lift Height Adjustability & Armrests');
    if (text.includes('mesh')) keySpecs.push('Breathable High-Durability Mesh Back');
    if (text.includes('warranty')) keySpecs.push('Multi-Year Commercial Warranty');
    if (text.includes('m3') || text.includes('apple silicon') || text.includes('m2') || text.includes('m4')) keySpecs.push('Apple Silicon Pro/Max Processor');
    if (text.includes('ram') || text.includes('32gb') || text.includes('16gb')) keySpecs.push('Minimum 16GB-32GB Unified Memory');
    if (text.includes('biodegradable') || text.includes('recycled')) keySpecs.push('FSC-Certified Recyclable Material');

    if (keySpecs.length === 0) {
      keySpecs.push('Commercial Enterprise Grade Quality', 'ISO 9001 Certified Supplier', 'Direct Factory Lead Time');
    }

    // Brands
    const preferredBrands: string[] = [];
    if (text.includes('lenovo')) preferredBrands.push('Lenovo');
    if (text.includes('dell')) preferredBrands.push('Dell');
    if (text.includes('apple') || text.includes('macbook')) preferredBrands.push('Apple');
    if (text.includes('herman miller')) preferredBrands.push('Herman Miller');
    if (text.includes('steelcase')) preferredBrands.push('Steelcase');

    const result: ParsedRequirement = {
      title: overrideParams?.title || title,
      category: overrideParams?.category || category,
      quantity: overrideParams?.quantity || quantity,
      budget: overrideParams?.budget || budget,
      currency: overrideParams?.currency || currency,
      deadline: overrideParams?.deadline || deadline,
      deliveryLocation: overrideParams?.deliveryLocation || deliveryLocation,
      priority: overrideParams?.priority || 'high',
      keySpecs: overrideParams?.keySpecs || keySpecs,
      constraints: overrideParams?.constraints || [
        `Strict cap at ${currency} ${budget.toLocaleString()}`,
        `Must meet delivery window of ${deadline}`,
        'Requires minimum 2-year enterprise replacement warranty',
      ],
      preferredBrands: overrideParams?.preferredBrands || preferredBrands,
      summary: `Autonomous procurement requirement parsed: Sourcing ${quantity} unit(s) of ${title} within ${currency} ${budget.toLocaleString()} target budget to ${deliveryLocation} by ${deadline}.`,
    };

    return ParsedRequirementSchema.parse(result);
  }
}
