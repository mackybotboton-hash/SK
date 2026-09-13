import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './pages/LoginPage';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PendingApprovalPage from './pages/PendingApprovalPage';
import { authController } from './controllers/AuthController';
import { useAuth } from './hooks/useAuth';
import DashboardPage from './pages/DashboardPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProposalListPage from './pages/ProposalListPage';
import ProposalFormPage from './pages/ProposalFormPage';
import ProposalReviewPage from './pages/ProposalReviewPage';
import BudgetPage from './pages/BudgetPage';
import ExpenseListPage from './pages/ExpenseListPage';
import DocumentListPage from './pages/DocumentListPage';
import SchedulePage from './pages/SchedulePage';
import ReportsPage from './pages/ReportsPage';
import AuditLogPage from './pages/AuditLogPage';
import UserManagementPage from './pages/UserManagementPage';
import NotFoundPage from './pages/NotFoundPage';
import { auditLogService } from './services/AuditLogService';
import { projectController } from './controllers/ProjectController';
import { proposalController } from './controllers/ProposalController';
import { financeController } from './controllers/FinanceController';
import { documentController } from './controllers/DocumentController';
import { scheduleController } from './controllers/ScheduleController';
import { userController } from './controllers/UserController';

/**
 * App — Root application component.
 * Sets up routing, authentication state, and the main layout.
 */
export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const { isAuthenticated, loading, user } = useAuth();

  useEffect(() => {
    // Initialize the auth controller
    const initAuth = async () => {
      await authController.initialize();
      
      // Inject audit logger into controllers
      projectController.setAuditService(auditLogService);
      proposalController.setAuditService(auditLogService);
      financeController.setAuditService(auditLogService);
      documentController.setAuditService(auditLogService);
      scheduleController.setAuditService(auditLogService);
      userController.setAuditService(auditLogService);

      setIsInitializing(false);
    };
    initAuth();

    return () => {
      authController.destroy();
    };
  }, []);

  const handleLogout = () => {
    authController.logout();
  };

  if (isInitializing) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-body)'
      }}>
        <div className="spinner-lg" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Landing Route for Visitors */}
        <Route path="/landing" element={<LandingPage />} />

        {/* Public Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />
          }
        />

        {/* Pending Route */}
        <Route
          path="/pending"
          element={
            isAuthenticated ? (
              user?.status === 'pending' ? <PendingApprovalPage /> : <Navigate to="/" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Protected Portal Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ProtectedRoute />
            ) : (
              <LandingPage />
            )
          }
        >
          <Route element={<AppLayout onLogout={handleLogout} />}>
            <Route index element={<DashboardPage />} />
            
            <Route path="projects" element={<ProtectedRoute permission="view:projects" />}>
              <Route index element={<ProjectListPage />} />
              <Route path=":id" element={<ProjectDetailPage />} />
            </Route>

            <Route path="proposals" element={<ProtectedRoute permission="view:proposals" />}>
              <Route index element={<ProposalListPage />} />
              <Route path="new" element={<ProtectedRoute permission="manage:proposals"><ProposalFormPage /></ProtectedRoute>} />
              <Route path=":id/edit" element={<ProtectedRoute permission="manage:proposals"><ProposalFormPage /></ProtectedRoute>} />
              <Route path=":id/review" element={<ProposalReviewPage />} />
            </Route>

            <Route path="budget" element={<ProtectedRoute permission="view:budgets" />}>
              <Route index element={<BudgetPage />} />
            </Route>

            <Route path="expenses" element={<ProtectedRoute permission="view:expenses" />}>
              <Route index element={<ExpenseListPage />} />
            </Route>

            <Route path="documents" element={<ProtectedRoute permission="view:documents" />}>
              <Route index element={<DocumentListPage />} />
            </Route>

            <Route path="schedule" element={<ProtectedRoute permission="view:schedules" />}>
              <Route index element={<SchedulePage />} />
            </Route>

            <Route path="reports" element={<ProtectedRoute permission="view:reports" />}>
              <Route index element={<ReportsPage />} />
            </Route>

            <Route path="audit" element={<ProtectedRoute permission="view:audit_logs" />}>
              <Route index element={<AuditLogPage />} />
            </Route>

            <Route path="users" element={<ProtectedRoute permission="manage:users" />}>
              <Route index element={<UserManagementPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
