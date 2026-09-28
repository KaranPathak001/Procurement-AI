import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, Company, AuditLog } from '../models/index.js';
import { RequirementParser } from '../ai/requirementParser.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { name, email, password, companyName, companySize, industry, location, currency } = req.body;

      if (!email || !password || !name || !companyName) {
        return res.status(400).json({ error: 'Please provide all required registration fields.' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'A user with this email address already exists.' });
      }

      const company = await Company.create({
        name: companyName,
        size: companySize || '50-250',
        industry: industry || 'Technology & Enterprise',
        procurementLocation: location || 'Delhi, India / Global',
        preferredCurrency: currency || 'USD',
        procurementCategories: ['IT Hardware', 'Office Furniture', 'Packaging & Supplies', 'Cloud & Servers'],
        monthlySpendBudget: 100000,
      });

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: 'admin',
        companyId: company._id,
        department: 'Procurement Leadership',
      });

      const secret = process.env.JWT_SECRET || 'super_secret_procureai_enterprise_jwt_key_2026_x89f';
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
        details: { companyName: company.name },
      });

      return res.status(201).json({
        message: 'Account created successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: company._id,
          companyName: company.name,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Server error during registration' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Please enter email and password' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const company = await Company.findById(user.companyId);

      const secret = process.env.JWT_SECRET || 'super_secret_procureai_enterprise_jwt_key_2026_x89f';
      const token = jwt.sign(
        {
          userId: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          companyId: user.companyId.toString(),
        },
        secret,
        { expiresIn: '7d' }
      );

      await AuditLog.create({
        companyId: user.companyId,
        userId: user._id,
        userName: user.name,
        action: 'USER_LOGIN',
        entityType: 'auth',
        entityId: user._id.toString(),
        details: { ip: req.ip },
      });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          companyId: user.companyId,
          companyName: company?.name || 'ProcureAI Enterprise',
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
      const company = await Company.findById(user.companyId);

      return res.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          department: user.department,
          companyId: user.companyId,
          company: company,
        },
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  static async updateOnboarding(req: Request, res: Response) {
    try {
      const { procurementCategories, monthlySpendBudget, preferredCurrency, procurementLocation } = req.body;
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

      return res.json({ message: 'Onboarding preferences updated', company });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }
}
