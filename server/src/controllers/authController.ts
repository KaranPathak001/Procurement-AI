import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Company, Vendor, AuditLog } from '../models/index.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const {
        name,
        email,
        password,
        role = 'buyer', // 'buyer' | 'vendor'
        companyName,
        industry,
        companySize,
        location,
        currency = 'INR',
        // Vendor-specific fields
        phone,
        description,
        website,
        categories,
        minOrderQuantity,
        averageDeliveryDays,
      } = req.body;

      if (!email || !password || !name || !companyName) {
        return res.status(400).json({ error: 'Please provide name, email, password, and company / vendor name.' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email address already exists.' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const secret = process.env.JWT_SECRET || 'super_secret_procureai_enterprise_jwt_key_2026_x89f';

      if (role === 'vendor') {
        // Register Vendor Account
        const vendor = await Vendor.create({
          name: companyName,
          categories: categories && categories.length > 0 ? categories : [industry || 'Commercial Equipment'],
          location: location || 'Delhi NCR Hub / India',
          description: description || '',
          website: website || '',
          phone: phone || '',
          minOrderQuantity: Number(minOrderQuantity) || 1,
          averageDeliveryDays: Number(averageDeliveryDays) || 14,
          reliabilityScore: 92,
          qualityScore: 90,
          pricingCompetitivenessScore: 88,
          verifiedSupplier: true,
          tier: 'tier_2_qualified',
          contacts: [
            {
              name,
              email: email.toLowerCase(),
              phone: phone || '',
              designation: 'Commercial Lead',
            },
          ],
        });

        const user = await User.create({
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'vendor',
          vendorId: vendor._id,
          department: 'Vendor Sales',
        });

        vendor.userId = user._id;
        await vendor.save();

        const token = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            vendorId: vendor._id.toString(),
          },
          secret,
          { expiresIn: '7d' }
        );

        return res.status(201).json({
          message: 'Vendor account created successfully',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: 'vendor',
            vendorId: vendor._id,
            companyName: vendor.name,
            vendor,
          },
        });
      } else {
        // Register Buyer / Company Account
        const company = await Company.create({
          name: companyName,
          size: companySize || '50-250',
          industry: industry || 'Technology & Enterprise',
          procurementLocation: location || 'Delhi, India / Global',
          preferredCurrency: currency || 'INR',
          procurementCategories: categories && categories.length > 0
            ? categories
            : ['IT Hardware', 'Ergonomic Office Furniture', 'Packaging & Supplies'],
          monthlySpendBudget: 1000000,
        });

        const user = await User.create({
          name,
          email: email.toLowerCase(),
          passwordHash,
          role: 'buyer',
          companyId: company._id,
          department: 'Procurement Leadership',
        });

        const token = jwt.sign(
          {
            userId: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
            companyId: company._id.toString(),
          },
          secret,
          { expiresIn: '7d' }
        );

        await AuditLog.create({
          companyId: company._id,
          userId: user._id,
          userName: user.name,
          action: 'USER_REGISTERED',
          entityType: 'auth',
          entityId: user._id.toString(),
          details: { companyName: company.name, role: 'buyer' },
        });

        return res.status(201).json({
          message: 'Company account created successfully',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: 'buyer',
            companyId: company._id,
            companyName: company.name,
            company,
          },
        });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error during registration' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Please enter your email and password' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const secret = process.env.JWT_SECRET || 'super_secret_procureai_enterprise_jwt_key_2026_x89f';

      let company = null;
      let vendor = null;

      if (user.role === 'vendor' || user.vendorId) {
        vendor = await Vendor.findById(user.vendorId);
      } else if (user.companyId) {
        company = await Company.findById(user.companyId);
      }

      const tokenPayload: any = {
        userId: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      };

      if (user.companyId) tokenPayload.companyId = user.companyId.toString();
      if (user.vendorId) tokenPayload.vendorId = user.vendorId.toString();

      const token = jwt.sign(tokenPayload, secret, { expiresIn: '7d' });

      if (user.companyId) {
        await AuditLog.create({
          companyId: user.companyId,
          userId: user._id,
          userName: user.name,
          action: 'USER_LOGIN',
          entityType: 'auth',
          entityId: user._id.toString(),
          details: { ip: req.ip },
        });
      }

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          vendorId: user.vendorId,
          companyName: company?.name || vendor?.name || 'ProcureAI Enterprise',
          company,
          vendor,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Login failed' });
    }
  }

  static async me(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user?.userId).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });

      let company = null;
      let vendor = null;

      if (user.role === 'vendor' || user.vendorId) {
        vendor = await Vendor.findById(user.vendorId);
      }
      if (user.companyId) {
        company = await Company.findById(user.companyId);
      }

      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          companyId: user.companyId,
          vendorId: user.vendorId,
          companyName: company?.name || vendor?.name || 'ProcureAI Account',
          company,
          vendor,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateOnboarding(req: Request, res: Response) {
    try {
      const {
        procurementCategories,
        monthlySpendBudget,
        preferredCurrency,
        procurementLocation,
        // vendor updates
        description,
        website,
        phone,
        minOrderQuantity,
        averageDeliveryDays,
      } = req.body;

      if (req.user?.role === 'vendor' || req.user?.vendorId) {
        const vendor = await Vendor.findByIdAndUpdate(
          req.user?.vendorId,
          {
            $set: {
              ...(description && { description }),
              ...(website && { website }),
              ...(phone && { phone }),
              ...(minOrderQuantity && { minOrderQuantity: Number(minOrderQuantity) }),
              ...(averageDeliveryDays && { averageDeliveryDays: Number(averageDeliveryDays) }),
              ...(procurementCategories && { categories: procurementCategories }),
            },
          },
          { new: true }
        );
        return res.json({ message: 'Vendor onboarding updated', vendor });
      }

      const company = await Company.findByIdAndUpdate(
        req.user?.companyId,
        {
          $set: {
            procurementCategories,
            monthlySpendBudget,
            preferredCurrency,
            procurementLocation,
          },
        },
        { new: true }
      );

      return res.json({ message: 'Company onboarding updated', company });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const { name, department, phone, companyName, location, website, description } = req.body;
      const user = await User.findById(req.user?.userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (name) user.name = name;
      if (department) user.department = department;
      await user.save();

      if (user.role === 'vendor' && user.vendorId) {
        await Vendor.findByIdAndUpdate(user.vendorId, {
          $set: {
            ...(companyName && { name: companyName }),
            ...(location && { location }),
            ...(website && { website }),
            ...(description && { description }),
            ...(phone && { phone }),
          },
        });
      } else if (user.companyId) {
        await Company.findByIdAndUpdate(user.companyId, {
          $set: {
            ...(companyName && { name: companyName }),
            ...(location && { procurementLocation: location }),
          },
        });
      }

      return res.json({ message: 'Profile updated successfully' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
