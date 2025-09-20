import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionHeader from '../../components/ui/SessionHeader';
import AlertBanner from '../../components/ui/AlertBanner';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import AccountSummaryCard from './components/AccountSummaryCard';
import TransactionFilters from './components/TransactionFilters';
import TransactionTable from './components/TransactionTable';
import ExportControls from './components/ExportControls';

const AccountDetails = () => {
  const location = useLocation();
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com"
  });

  const [account] = useState({
    id: "acc_001",
    name: "Primary Checking",
    type: "Checking Account",
    status: "active",
    currentBalance: 12847.65,
    availableBalance: 12347.65,
    accountNumber: "1234567890123456",
    routingNumber: "021000021"
  });

  const [allTransactions] = useState([
    {
      id: "txn_001",
      date: "2025-01-13",
      description: "Direct Deposit - Salary",
      merchant: "TechCorp Inc",
      amount: 3250.00,
      balance: 12847.65,
      type: "deposit",
      category: "salary",
      status: "completed",
      transactionId: "TXN20250113001",
      reference: "DD-SALARY-JAN2025"
    },
    {
      id: "txn_002",
      date: "2025-01-12",
      description: "Grocery Store Purchase",
      merchant: "Whole Foods Market",
      amount: -127.43,
      balance: 9597.65,
      type: "payment",
      category: "groceries",
      status: "completed",
      transactionId: "TXN20250112002"
    },
    {
      id: "txn_003",
      date: "2025-01-12",
      description: "ATM Withdrawal",
      merchant: "Chase ATM #4521",
      amount: -100.00,
      balance: 9725.08,
      type: "withdrawal",
      category: "cash",
      status: "completed",
      transactionId: "TXN20250112003"
    },
    {
      id: "txn_004",
      date: "2025-01-11",
      description: "Online Transfer to Savings",
      merchant: "Internal Transfer",
      amount: -500.00,
      balance: 9825.08,
      type: "transfer",
      category: "transfer",
      status: "completed",
      transactionId: "TXN20250111004",
      reference: "SAVE-GOAL-JAN"
    },
    {
      id: "txn_005",
      date: "2025-01-11",
      description: "Electric Bill Payment",
      merchant: "City Electric Company",
      amount: -89.67,
      balance: 10325.08,
      type: "payment",
      category: "utilities",
      status: "completed",
      transactionId: "TXN20250111005"
    },
    {
      id: "txn_006",
      date: "2025-01-10",
      description: "Coffee Shop Purchase",
      merchant: "Starbucks #1247",
      amount: -12.45,
      balance: 10414.75,
      type: "payment",
      category: "dining",
      status: "completed",
      transactionId: "TXN20250110006"
    },
    {
      id: "txn_007",
      date: "2025-01-10",
      description: "Gas Station Purchase",
      merchant: "Shell Gas Station",
      amount: -45.20,
      balance: 10427.20,
      type: "payment",
      category: "transportation",
      status: "completed",
      transactionId: "TXN20250110007"
    },
    {
      id: "txn_008",
      date: "2025-01-09",
      description: "Mobile Check Deposit",
      merchant: "Tax Refund Check",
      amount: 850.00,
      balance: 10472.40,
      type: "deposit",
      category: "refund",
      status: "processing",
      transactionId: "TXN20250109008",
      reference: "TAX-REFUND-2024"
    },
    {
      id: "txn_009",
      date: "2025-01-09",
      description: "Restaurant Payment",
      merchant: "The Italian Kitchen",
      amount: -67.89,
      balance: 9622.40,
      type: "payment",
      category: "dining",
      status: "completed",
      transactionId: "TXN20250109009"
    },
    {
      id: "txn_010",
      date: "2025-01-08",
      description: "Monthly Service Fee",
      merchant: "BankingHub",
      amount: -12.00,
      balance: 9690.29,
      type: "fee",
      category: "fees",
      status: "completed",
      transactionId: "TXN20250108010"
    },
    {
      id: "txn_011",
      date: "2025-01-08",
      description: "Interest Earned",
      merchant: "BankingHub",
      amount: 2.15,
      balance: 9702.29,
      type: "interest",
      category: "interest",
      status: "completed",
      transactionId: "TXN20250108011"
    },
    {
      id: "txn_012",
      date: "2025-01-07",
      description: "Online Shopping",
      merchant: "Amazon.com",
      amount: -156.78,
      balance: 9700.14,
      type: "payment",
      category: "shopping",
      status: "completed",
      transactionId: "TXN20250107012"
    }
  ]);

  const [filteredTransactions, setFilteredTransactions] = useState(allTransactions);
  const [alerts] = useState([
    {
      id: 'alert_001',
      type: 'info',
      title: 'Mobile Check Deposit Processing',
      message: 'Your check deposit of $850.00 is being processed and will be available within 1-2 business days.',
      dismissible: true
    }
  ]);

  const [quickActionOpen, setQuickActionOpen] = useState(false);

  const handleFilterChange = (filters) => {
    let filtered = [...allTransactions];

    // Search filter
    if (filters?.searchTerm) {
      const searchTerm = filters?.searchTerm?.toLowerCase();
      filtered = filtered?.filter(transaction =>
        transaction?.description?.toLowerCase()?.includes(searchTerm) ||
        transaction?.merchant?.toLowerCase()?.includes(searchTerm) ||
        Math.abs(transaction?.amount)?.toString()?.includes(searchTerm)
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(transaction =>
        new Date(transaction.date) >= new Date(filters.dateFrom)
      );
    }
    if (filters?.dateTo) {
      filtered = filtered?.filter(transaction =>
        new Date(transaction.date) <= new Date(filters.dateTo)
      );
    }

    // Category filter
    if (filters?.category) {
      if (filters?.category === 'deposit') {
        filtered = filtered?.filter(transaction => transaction?.amount > 0);
      } else if (filters?.category === 'withdrawal') {
        filtered = filtered?.filter(transaction => transaction?.amount < 0);
      } else {
        filtered = filtered?.filter(transaction => transaction?.type === filters?.category);
      }
    }

    // Amount range filter
    if (filters?.amountMin) {
      filtered = filtered?.filter(transaction =>
        Math.abs(transaction?.amount) >= parseFloat(filters?.amountMin)
      );
    }
    if (filters?.amountMax) {
      filtered = filtered?.filter(transaction =>
        Math.abs(transaction?.amount) <= parseFloat(filters?.amountMax)
      );
    }

    setFilteredTransactions(filtered);
  };

  const handleExport = (exportOptions) => {
    console.log('Exporting transactions:', exportOptions);
    // Export functionality would be implemented here
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleExtendSession = () => {
    console.log('Session extended');
  };

  useEffect(() => {
    document.title = 'Account Details - BankingHub';
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header user={user} onLogout={handleLogout} onToggleSidebar={() => {}} />
      <div className="bg-card border-b border-border px-6 py-3">
        <SessionHeader
          user={user}
          onLogout={handleLogout}
          onExtendSession={handleExtendSession}
        />
      </div>
      <main className="container mx-auto px-6 py-8 max-w-7xl">
        <BreadcrumbTrail customBreadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Accounts', href: '/accounts' },
          { label: account.name }
        ]} />
        
        <AlertBanner alerts={alerts} onDismiss={(alertId) => console.log('Dismissed alert:', alertId)} />

        <div className="space-y-6">
          <AccountSummaryCard account={account} />
          
          <ExportControls
            transactionCount={filteredTransactions?.length}
            onExport={handleExport}
          />
          
          <TransactionFilters
            onFilterChange={handleFilterChange}
            transactionCount={filteredTransactions?.length}
          />
          
          <TransactionTable
            transactions={filteredTransactions}
            onTransactionSelect={(transaction) => console.log('Selected transaction:', transaction)}
          />
        </div>
      </main>
      <QuickActionPanel
        isOpen={quickActionOpen}
        onToggle={setQuickActionOpen}
        recentActions={[
          { label: 'Transfer to Savings', timestamp: new Date() },
          { label: 'Pay Electric Bill', timestamp: new Date() },
          { label: 'Mobile Deposit', timestamp: new Date() }
        ]}
      />
    </div>
  );
};

export default AccountDetails;