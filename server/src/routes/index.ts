import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { ProcurementController } from '../controllers/procurementController.js';
import { WorkflowController } from '../controllers/workflowController.js';
import { VendorController } from '../controllers/vendorController.js';
import { authenticateToken, requireRole } from '../middleware/auth.js';

const router = Router();

// ─── Public Routes ───────────────────────────────────────────────────────────
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);

// Public vendor directory (buyers can browse without login)
router.get('/vendors', VendorController.listPublicVendors);
router.get('/vendors/:id', VendorController.getVendorPublicProfile);

// ─── All routes below require authentication ─────────────────────────────────
router.use(authenticateToken);

// User profile & onboarding
router.get('/me', AuthController.me);
router.post('/onboarding', AuthController.updateOnboarding);

// ─── Buyer-only Routes ───────────────────────────────────────────────────────
router.post('/procurements/parse', requireRole(['buyer']), ProcurementController.parseRequirement);
router.get('/procurements', requireRole(['buyer']), ProcurementController.listProcurements);
router.post('/procurements', requireRole(['buyer']), ProcurementController.createProcurement);
router.get('/procurements/:id', requireRole(['buyer']), ProcurementController.getProcurementById);
router.post('/procurements/:id/run-agent', requireRole(['buyer']), ProcurementController.runAgent);
router.get('/procurements/:id/events', requireRole(['buyer']), ProcurementController.getEvents);

// Approvals & Purchase Orders (buyers only)
router.get('/approvals', requireRole(['buyer']), WorkflowController.listApprovals);
router.post('/approvals/:id/approve', requireRole(['buyer']), WorkflowController.approveRequest);
router.post('/approvals/:id/reject', requireRole(['buyer']), WorkflowController.rejectRequest);
router.get('/purchase-orders', requireRole(['buyer']), WorkflowController.listPurchaseOrders);

// Analytics & Notifications (buyer dashboard)
router.get('/analytics/dashboard', requireRole(['buyer']), WorkflowController.getDashboardMetrics);
router.get('/notifications', authenticateToken, WorkflowController.getNotifications);

// AI Assistant (buyers only for now)
router.post('/ai/chat', requireRole(['buyer']), WorkflowController.chatAssistant);

// ─── Vendor-only Routes ──────────────────────────────────────────────────────
router.get('/vendor/profile', requireRole(['vendor']), VendorController.getMyProfile);
router.patch('/vendor/profile', requireRole(['vendor']), VendorController.updateProfile);

router.get('/vendor/products', requireRole(['vendor']), VendorController.listMyProducts);
router.post('/vendor/products', requireRole(['vendor']), VendorController.createProduct);
router.patch('/vendor/products/:productId', requireRole(['vendor']), VendorController.updateProduct);
router.delete('/vendor/products/:productId', requireRole(['vendor']), VendorController.deleteProduct);

router.get('/vendor/rfqs', requireRole(['vendor']), VendorController.listMyRFQs);
router.post('/vendor/rfqs/:rfqId/quote', requireRole(['vendor']), VendorController.submitQuote);

router.get('/vendor/quotes', requireRole(['vendor']), VendorController.listMyQuotes);
router.get('/vendor/orders', requireRole(['vendor']), VendorController.listMyOrders);
router.get('/vendor/dashboard', requireRole(['vendor']), VendorController.getDashboard);

export default router;
