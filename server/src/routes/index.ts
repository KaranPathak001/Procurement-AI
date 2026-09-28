import { Router } from 'express';
import { AuthController } from '../controllers/authController.js';
import { ProcurementController } from '../controllers/procurementController.js';
import { WorkflowController } from '../controllers/workflowController.js';
import { authenticateToken } from '../middleware/auth.js';
import { seedInitialDemoData } from '../scripts/seed.js';

const router = Router();

// Public Auth routes
router.post('/auth/register', AuthController.register);
router.post('/auth/login', AuthController.login);
router.post('/demo/seed', async (req, res) => {
  try {
    const result = await seedInitialDemoData();
    res.json({ message: 'Demo environment successfully initialized', result });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Protected routes
router.use(authenticateToken);

// User & Onboarding
router.get('/me', AuthController.me);
router.post('/onboarding', AuthController.updateOnboarding);

// Procurements
router.post('/procurements/parse', ProcurementController.parseRequirement);
router.get('/procurements', ProcurementController.listProcurements);
router.post('/procurements', ProcurementController.createProcurement);
router.get('/procurements/:id', ProcurementController.getProcurementById);
router.post('/procurements/:id/run-agent', ProcurementController.runAgent);
router.get('/procurements/:id/events', ProcurementController.getEvents);

// Approvals & Purchase Orders
router.get('/approvals', WorkflowController.listApprovals);
router.post('/approvals/:id/approve', WorkflowController.approveRequest);
router.post('/approvals/:id/reject', WorkflowController.rejectRequest);

router.get('/purchase-orders', WorkflowController.listPurchaseOrders);

// Vendors & Directory
router.get('/vendors', WorkflowController.listVendors);
router.get('/vendors/:id', WorkflowController.getVendorById);

// Assistant & Analytics & Notifications
router.post('/ai/chat', WorkflowController.chatAssistant);
router.get('/analytics/dashboard', WorkflowController.getDashboardMetrics);
router.get('/notifications', WorkflowController.getNotifications);

export default router;
