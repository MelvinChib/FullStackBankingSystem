import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BudgetTracker from './pages/budget-tracker';
import Login from './pages/login';
import BillPayPage from './pages/bill-pay';
import AccountDetails from './pages/account-details';
import TransferFunds from './pages/transfer-funds';
import AccountDashboard from './pages/account-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<AccountDashboard />} />
        <Route path="/budget-tracker" element={<BudgetTracker />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bill-pay" element={<BillPayPage />} />
        <Route path="/account-details" element={<AccountDetails />} />
        <Route path="/transfer-funds" element={<TransferFunds />} />
        <Route path="/account-dashboard" element={<AccountDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
