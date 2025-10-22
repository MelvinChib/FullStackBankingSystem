import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import { ProtectedRoute, PublicOnlyRoute, PermissionRoute } from './components/auth/RouteGuards';
import Logout from './pages/logout';
import BudgetTracker from './pages/budget-tracker';
import Login from './pages/login';
import BillPayPage from './pages/bill-pay';
import AccountDetails from './pages/account-details';
import TransferFunds from './pages/transfer-funds';
import AccountDashboard from './pages/account-dashboard';
import Home from './pages/home';
import MobileMoney from './pages/mobile-money';
import ForgotPassword from './pages/login/ForgotPassword';
import ResetPassword from './pages/login/ResetPassword';
import Profile from './pages/profile';
import Settings from './pages/settings';
import Help from './pages/help';
import Statements from './pages/statements/index.jsx';
import MobileDeposit from './pages/mobile-deposit';
import Register from './pages/register';
import Customer from './pages/customer';
import About from './pages/about';
import Support from './pages/support';
import Admin from './pages/admin';
import AdminUsers from './pages/admin/users';
import AdminSettings from './pages/admin/settings';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Home />} />
        <Route path="/account-dashboard" element={<PermissionRoute permission="VIEW_DASHBOARD"><AccountDashboard /></PermissionRoute>} />
        <Route path="/budget-tracker" element={<PermissionRoute permission="VIEW_BUDGET"><BudgetTracker /></PermissionRoute>} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<PublicOnlyRoute><ForgotPassword /></PublicOnlyRoute>} />
        <Route path="/reset-password" element={<PublicOnlyRoute><ResetPassword /></PublicOnlyRoute>} />
        <Route path="/bill-pay" element={<PermissionRoute permission="BILL_PAY"><BillPayPage /></PermissionRoute>} />
        <Route path="/account-details" element={<PermissionRoute permission="VIEW_ACCOUNTS"><AccountDetails /></PermissionRoute>} />
        <Route path="/transfer-funds" element={<PermissionRoute permission="TRANSFER_FUNDS"><TransferFunds /></PermissionRoute>} />
        <Route path="/mobile-money" element={<PermissionRoute permission="MOBILE_MONEY"><MobileMoney /></PermissionRoute>} />
        <Route path="/mobile-deposit" element={<PermissionRoute permission="MOBILE_DEPOSIT"><MobileDeposit /></PermissionRoute>} />
        <Route path="/profile" element={<PermissionRoute permission="VIEW_PROFILE"><Profile /></PermissionRoute>} />
        <Route path="/settings" element={<PermissionRoute permission="VIEW_SETTINGS"><Settings /></PermissionRoute>} />
        <Route path="/statements" element={<PermissionRoute permission="VIEW_STATEMENTS"><Statements /></PermissionRoute>} />
        <Route path="/help" element={<Help />} />
        <Route path="/support" element={<PermissionRoute permission="VIEW_SUPPORT"><Support /></PermissionRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
