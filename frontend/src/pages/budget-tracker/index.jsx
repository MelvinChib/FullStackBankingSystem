import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import SessionHeader from '../../components/ui/SessionHeader';
import AlertBanner from '../../components/ui/AlertBanner';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Select from '../../components/ui/Select';

// Import all components
import BudgetCategoryCard from './components/BudgetCategoryCard';
import SpendingChart from './components/SpendingChart';
import BudgetSetupModal from './components/BudgetSetupModal';
import GoalTracker from './components/GoalTracker';
import TransactionCategorizer from './components/TransactionCategorizer';
import SpendingAlerts from './components/SpendingAlerts';

const BudgetTracker = () => {
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    accountNumber: "****1234"
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Mock budget categories data
  const [budgetCategories, setBudgetCategories] = useState([
    {
      id: 1,
      name: "Groceries",
      description: "Food and household items",
      allocated: 800,
      spent: 650,
      remaining: 150,
      icon: "ShoppingCart",
      color: "bg-primary",
      type: "monthly"
    },
    {
      id: 2,
      name: "Transportation",
      description: "Gas, public transit, car maintenance",
      allocated: 400,
      spent: 420,
      remaining: -20,
      icon: "Car",
      color: "bg-secondary",
      type: "monthly"
    },
    {
      id: 3,
      name: "Entertainment",
      description: "Movies, dining out, subscriptions",
      allocated: 300,
      spent: 180,
      remaining: 120,
      icon: "Gamepad2",
      color: "bg-accent",
      type: "monthly"
    },
    {
      id: 4,
      name: "Healthcare",
      description: "Medical expenses and insurance",
      allocated: 200,
      spent: 85,
      remaining: 115,
      icon: "Heart",
      color: "bg-success",
      type: "monthly"
    },
    {
      id: 5,
      name: "Housing",
      description: "Rent, utilities, maintenance",
      allocated: 1500,
      spent: 1500,
      remaining: 0,
      icon: "Home",
      color: "bg-warning",
      type: "monthly"
    },
    {
      id: 6,
      name: "Education",
      description: "Books, courses, training",
      allocated: 150,
      spent: 45,
      remaining: 105,
      icon: "GraduationCap",
      color: "bg-error",
      type: "monthly"
    }
  ]);

  // Mock spending chart data
  const [spendingData] = useState([
    { name: 'Jan', amount: 2800 },
    { name: 'Feb', amount: 3200 },
    { name: 'Mar', amount: 2900 },
    { name: 'Apr', amount: 3400 },
    { name: 'May', amount: 3100 },
    { name: 'Jun', amount: 3350 },
  ]);

  // Mock category breakdown data
  const [categoryData] = useState([
    { name: 'Housing', amount: 1500 },
    { name: 'Groceries', amount: 650 },
    { name: 'Transportation', amount: 420 },
    { name: 'Entertainment', amount: 180 },
    { name: 'Healthcare', amount: 85 },
    { name: 'Education', amount: 45 },
  ]);

  // Mock financial goals
  const [financialGoals, setFinancialGoals] = useState([
    {
      id: 1,
      name: "Emergency Fund",
      description: "Build 6 months of expenses",
      type: "savings",
      current: 8500,
      target: 18000,
      targetDate: "2024-12-31",
      color: "bg-success",
      monthlyTarget: 950
    },
    {
      id: 2,
      name: "Credit Card Debt",
      description: "Pay off remaining balance",
      type: "debt",
      current: 2400,
      target: 0,
      targetDate: "2024-08-31",
      color: "bg-error"
    },
    {
      id: 3,
      name: "Vacation Fund",
      description: "Save for Europe trip",
      type: "savings",
      current: 1200,
      target: 5000,
      targetDate: "2024-06-15",
      color: "bg-accent",
      monthlyTarget: 633
    }
  ]);

  // Mock transactions for categorization
  const [transactions] = useState([
    {
      id: 1,
      description: "Whole Foods Market",
      amount: -85.42,
      date: "2024-01-10",
      type: "expense",
      category: 1
    },
    {
      id: 2,
      description: "Shell Gas Station",
      amount: -45.00,
      date: "2024-01-09",
      type: "expense",
      category: 2
    },
    {
      id: 3,
      description: "Netflix Subscription",
      amount: -15.99,
      date: "2024-01-08",
      type: "expense",
      category: null
    },
    {
      id: 4,
      description: "Salary Deposit",
      amount: 3500.00,
      date: "2024-01-01",
      type: "income",
      category: null
    },
    {
      id: 5,
      description: "Amazon Purchase",
      amount: -67.89,
      date: "2024-01-07",
      type: "expense",
      category: null
    },
    {
      id: 6,
      description: "Starbucks",
      amount: -12.45,
      date: "2024-01-06",
      type: "expense",
      category: null
    }
  ]);

  // Mock spending alerts
  const [spendingAlerts, setSpendingAlerts] = useState([
    {
      id: 1,
      name: "Groceries Warning",
      category: "Groceries",
      threshold: 80,
      type: "percentage",
      isActive: true,
      severity: "warning",
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      lastTriggered: "2024-01-08",
      triggerCount: 3
    },
    {
      id: 2,
      name: "Transportation Overspend",
      category: "Transportation",
      threshold: 400,
      type: "amount",
      isActive: true,
      severity: "critical",
      notifications: {
        email: true,
        push: true,
        sms: true
      },
      lastTriggered: "2024-01-09",
      triggerCount: 1
    }
  ]);

  // Mock alerts for banner
  const [alerts] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Budget Alert',
      message: 'You have exceeded your Transportation budget by $20 this month.',
      dismissible: true
    },
    {
      id: 2,
      type: 'info',
      title: 'Goal Progress',
      message: 'You are 47% towards your Emergency Fund goal. Keep it up!',
      dismissible: true
    }
  ]);

  const tabs = [
    { id: 'overview', label: 'Budget Overview', icon: 'LayoutDashboard' },
    { id: 'categories', label: 'Categories', icon: 'Grid3X3' },
    { id: 'goals', label: 'Financial Goals', icon: 'Target' },
    { id: 'transactions', label: 'Categorize', icon: 'FileText' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell' },
  ];

  const timeRangeOptions = [
    { value: 'current', label: 'Current Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' },
  ];

  const [selectedTimeRange, setSelectedTimeRange] = useState('current');

  // Calculate budget summary
  const budgetSummary = budgetCategories?.reduce((acc, category) => ({
    totalAllocated: acc?.totalAllocated + category?.allocated,
    totalSpent: acc?.totalSpent + category?.spent,
    totalRemaining: acc?.totalRemaining + category?.remaining,
  }), { totalAllocated: 0, totalSpent: 0, totalRemaining: 0 });

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleExtendSession = () => {
    console.log('Session extended');
  };

  const handleCategoryDetails = (category) => {
    console.log('View category details:', category);
  };

  const handleEditBudget = (category) => {
    setEditingCategory(category);
    setShowBudgetModal(true);
  };

  const handleSaveBudget = (budgetData) => {
    if (editingCategory) {
      setBudgetCategories(prev => 
        prev?.map(cat => cat?.id === budgetData?.id ? budgetData : cat)
      );
    } else {
      setBudgetCategories(prev => [...prev, budgetData]);
    }
    setEditingCategory(null);
  };

  const handleAddGoal = (goalData) => {
    setFinancialGoals(prev => [...prev, { ...goalData, id: Date.now() }]);
  };

  const handleUpdateGoal = (goalId, updates) => {
    setFinancialGoals(prev => 
      prev?.map(goal => goal?.id === goalId ? { ...goal, ...updates } : goal)
    );
  };

  const handleCategorizeTransaction = (transactionId, categoryId) => {
    console.log('Categorize transaction:', transactionId, 'to category:', categoryId);
  };

  const handleBulkCategorize = (transactionIds, categoryId) => {
    console.log('Bulk categorize transactions:', transactionIds, 'to category:', categoryId);
  };

  const handleUpdateAlert = (alertId, updates) => {
    setSpendingAlerts(prev => 
      prev?.map(alert => alert?.id === alertId ? { ...alert, ...updates } : alert)
    );
  };

  const handleCreateAlert = (alertData) => {
    setSpendingAlerts(prev => [...prev, alertData]);
  };

  const handleChartDrillDown = (data) => {
    console.log('Chart drill down:', data);
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
          <div className="flex items-center space-x-4">
            <SessionHeader 
              user={user}
              onLogout={handleLogout}
              onExtendSession={handleExtendSession}
            />
          </div>
        </div>

        <BreadcrumbTrail customBreadcrumbs={[]} />
        
        <AlertBanner alerts={alerts} onDismiss={() => {}} />

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Budget Tracker</h1>
            <p className="text-muted-foreground">
              Monitor spending patterns and manage your financial goals
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-4 lg:mt-0">
            <Select
              options={timeRangeOptions}
              value={selectedTimeRange}
              onChange={setSelectedTimeRange}
              className="w-full sm:w-48"
            />
            <Button
              variant="default"
              iconName="Plus"
              onClick={() => setShowBudgetModal(true)}
            >
              Add Category
            </Button>
            <Button
              variant="outline"
              iconName="Download"
            >
              Export Report
            </Button>
          </div>
        </div>

        {/* Budget Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Wallet" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Budget</h3>
                <p className="text-2xl font-bold text-foreground">
                  ${budgetSummary?.totalAllocated?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error rounded-lg flex items-center justify-center">
                <Icon name="TrendingUp" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Total Spent</h3>
                <p className="text-2xl font-bold text-foreground">
                  ${budgetSummary?.totalSpent?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`w-10 h-10 ${
                budgetSummary?.totalRemaining >= 0 ? 'bg-success' : 'bg-error'
              } rounded-lg flex items-center justify-center`}>
                <Icon name="PiggyBank" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Remaining</h3>
                <p className={`text-2xl font-bold ${
                  budgetSummary?.totalRemaining >= 0 ? 'text-success' : 'text-error'
                }`}>
                  ${Math.abs(budgetSummary?.totalRemaining)?.toLocaleString()}
                  {budgetSummary?.totalRemaining < 0 && ' over'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <SpendingChart 
                  data={spendingData} 
                  type="line"
                  onDrillDown={handleChartDrillDown}
                />
                <SpendingChart 
                  data={categoryData} 
                  type="pie"
                  onDrillDown={handleChartDrillDown}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {budgetCategories?.slice(0, 6)?.map((category) => (
                  <BudgetCategoryCard
                    key={category?.id}
                    category={category}
                    onViewDetails={handleCategoryDetails}
                    onEditBudget={handleEditBudget}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === 'categories' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {budgetCategories?.map((category) => (
                <BudgetCategoryCard
                  key={category?.id}
                  category={category}
                  onViewDetails={handleCategoryDetails}
                  onEditBudget={handleEditBudget}
                />
              ))}
            </div>
          )}

          {activeTab === 'goals' && (
            <GoalTracker
              goals={financialGoals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
            />
          )}

          {activeTab === 'transactions' && (
            <TransactionCategorizer
              transactions={transactions}
              categories={budgetCategories}
              onCategorize={handleCategorizeTransaction}
              onBulkCategorize={handleBulkCategorize}
            />
          )}

          {activeTab === 'alerts' && (
            <SpendingAlerts
              alerts={spendingAlerts}
              onUpdateAlert={handleUpdateAlert}
              onCreateAlert={handleCreateAlert}
            />
          )}
        </div>
      </div>
      <BudgetSetupModal
        isOpen={showBudgetModal}
        onClose={() => {
          setShowBudgetModal(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveBudget}
        editingCategory={editingCategory}
      />
      <QuickActionPanel
        isOpen={quickActionOpen}
        onToggle={setQuickActionOpen}
      />
    </div>
  );
};

export default BudgetTracker;