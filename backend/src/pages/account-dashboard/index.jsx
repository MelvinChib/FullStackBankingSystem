import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionHeader from '../../components/ui/SessionHeader';
import AlertBanner from '../../components/ui/AlertBanner';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import WelcomeHeader from './components/WelcomeHeader';
import AccountCard from './components/AccountCard';
import RecentTransactions from './components/RecentTransactions';
import QuickActions from './components/QuickActions';
import FinancialInsights from './components/FinancialInsights';

const AccountDashboard = () => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quickActionPanelOpen, setQuickActionPanelOpen] = useState(false);

  // Mock user data
  const user = {
    firstName: "John",
    name: "John Smith",
    email: "john.smith@email.com",
    accountId: "ACC123456789"
  };

  // Mock account data
  const accounts = [
    {
      id: "1",
      name: "Primary Checking",
      type: "checking",
      accountNumber: "1234567890",
      balance: 2847.65,
      lastActivity: "2 hours ago"
    },
    {
      id: "2",
      name: "High-Yield Savings",
      type: "savings",
      accountNumber: "0987654321",
      balance: 15420.30,
      lastActivity: "1 day ago"
    },
    {
      id: "3",
      name: "Rewards Credit Card",
      type: "credit",
      accountNumber: "4567890123",
      balance: 1250.75,
      creditLimit: 5000.00,
      lastActivity: "3 hours ago"
    }
  ];

  // Mock transaction data
  const recentTransactions = [
    {
      id: "1",
      description: "Grocery Store Purchase",
      merchant: "Whole Foods Market",
      amount: -89.47,
      date: "2025-01-13",
      category: "shopping",
      pending: false
    },
    {
      id: "2",
      description: "Direct Deposit",
      merchant: "ABC Company Payroll",
      amount: 2500.00,
      date: "2025-01-12",
      category: "deposit",
      pending: false
    },
    {
      id: "3",
      description: "Coffee Shop",
      merchant: "Starbucks #1234",
      amount: -5.75,
      date: "2025-01-12",
      category: "food",
      pending: true
    },
    {
      id: "4",
      description: "Gas Station",
      merchant: "Shell Gas Station",
      amount: -45.20,
      date: "2025-01-11",
      category: "gas",
      pending: false
    },
    {
      id: "5",
      description: "Online Transfer",
      merchant: "Transfer to Savings",
      amount: -500.00,
      date: "2025-01-11",
      category: "transfer",
      pending: false
    },
    {
      id: "6",
      description: "Electric Bill",
      merchant: "City Electric Company",
      amount: -125.30,
      date: "2025-01-10",
      category: "bill",
      pending: false
    },
    {
      id: "7",
      description: "Restaurant",
      merchant: "The Italian Place",
      amount: -67.85,
      date: "2025-01-10",
      category: "food",
      pending: false
    },
    {
      id: "8",
      description: "ATM Withdrawal",
      merchant: "BankingHub ATM #567",
      amount: -100.00,
      date: "2025-01-09",
      category: "withdrawal",
      pending: false
    }
  ];

  // Mock spending data for insights
  const spendingData = [
    { name: "Food & Dining", amount: 450.30 },
    { name: "Shopping", amount: 320.75 },
    { name: "Transportation", amount: 180.50 },
    { name: "Bills & Utilities", amount: 275.80 },
    { name: "Entertainment", amount: 125.40 },
    { name: "Healthcare", amount: 95.25 }
  ];

  // Mock budget data
  const budgetData = [
    { category: "Food", spent: 450.30, budget: 500.00 },
    { category: "Shopping", spent: 320.75, budget: 300.00 },
    { category: "Transportation", spent: 180.50, budget: 200.00 },
    { category: "Bills", spent: 275.80, budget: 350.00 },
    { category: "Entertainment", spent: 125.40, budget: 150.00 }
  ];

  // Mock alerts
  const alerts = [
    {
      id: "1",
      type: "warning",
      title: "Budget Alert",
      message: "You've exceeded your shopping budget by $20.75 this month.",
      action: {
        label: "View Budget",
        onClick: () => navigate('/budget-tracker')
      }
    },
    {
      id: "2",
      type: "info",
      title: "New Feature",
      message: "Mobile check deposit is now available! Deposit checks instantly with your camera.",
      action: {
        label: "Try Now",
        onClick: () => navigate('/mobile-deposit')
      }
    }
  ];

  const lastLogin = "2025-01-13T10:30:00Z";

  const handleRefreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  const handleViewAccountDetails = (account) => {
    navigate('/account-details', { state: { accountId: account?.id } });
  };

  const handleQuickAccountAction = (account) => {
    if (account?.type === 'credit') {
      navigate('/bill-pay');
    } else {
      navigate('/transfer-funds');
    }
  };

  const handleViewAllTransactions = () => {
    navigate('/account-details');
  };

  const handleSearchTransaction = (searchTerm) => {
    // In a real app, this would trigger a search API call
    console.log('Searching for:', searchTerm);
  };

  const handleQuickActionClick = (action) => {
    console.log('Quick action clicked:', action?.id);
  };

  const handleViewBudget = () => {
    navigate('/budget-tracker');
  };

  const handleExtendSession = () => {
    console.log('Session extended');
  };

  const handleAlertDismiss = (alertId) => {
    console.log('Alert dismissed:', alertId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={() => {}} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <BreadcrumbTrail 
            customBreadcrumbs={[
              { label: 'Home', href: '/dashboard' },
              { label: 'Account Dashboard', href: '/account-dashboard' }
            ]} 
          />
          <SessionHeader
            user={user}
            onLogout={handleLogout}
            onExtendSession={handleExtendSession}
          />
        </div>

        <AlertBanner alerts={alerts} onDismiss={handleAlertDismiss} />

        <WelcomeHeader
          user={user}
          lastLogin={lastLogin}
          onRefreshData={handleRefreshData}
          isRefreshing={isRefreshing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {accounts?.map((account) => (
            <AccountCard
              key={account?.id}
              account={account}
              onViewDetails={handleViewAccountDetails}
              onQuickAction={handleQuickAccountAction}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2">
            <RecentTransactions
              transactions={recentTransactions}
              onViewAll={handleViewAllTransactions}
              onSearchTransaction={handleSearchTransaction}
            />
          </div>
          <div>
            <FinancialInsights
              spendingData={spendingData}
              budgetData={budgetData}
              alerts={alerts}
              onViewBudget={handleViewBudget}
            />
          </div>
        </div>

        <QuickActions onActionClick={handleQuickActionClick} />
      </div>
      <QuickActionPanel
        isOpen={quickActionPanelOpen}
        onToggle={setQuickActionPanelOpen}
        recentActions={[
          { label: "Transfer to Savings", timestamp: "2 hours ago" },
          { label: "Pay Electric Bill", timestamp: "1 day ago" },
          { label: "Mobile Deposit", timestamp: "3 days ago" }
        ]}
      />
    </div>
  );
};

export default AccountDashboard;