import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import SessionHeader from '../../components/ui/SessionHeader';
import AlertBanner from '../../components/ui/AlertBanner';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionPanel from '../../components/ui/QuickActionPanel';

// Import components
import PaymentForm from './components/PaymentForm';
import BillsList from './components/BillsList';
import PayeeManager from './components/PayeeManager';
import PaymentCalendar from './components/PaymentCalendar';
import PaymentHistory from './components/PaymentHistory';
import AutoPaySettings from './components/AutoPaySettings';

const BillPayPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('bills');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showPayeeManager, setShowPayeeManager] = useState(false);
  const [showAutoPaySettings, setShowAutoPaySettings] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [user] = useState({
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    accountNumber: "****1234"
  });

  // Mock data
  const [payees] = useState([
    {
      id: "payee1",
      name: "Electric Company",
      nickname: "Power Bill",
      accountNumber: "123456789",
      address: "123 Power St, Energy City, EC 12345",
      paymentMethod: "electronic",
      category: "utilities"
    },
    {
      id: "payee2",
      name: "Water & Sewer Department",
      accountNumber: "WS987654321",
      address: "456 Water Ave, Flow Town, FT 67890",
      paymentMethod: "electronic",
      category: "utilities"
    },
    {
      id: "payee3",
      name: "Chase Credit Card",
      accountNumber: "4532********1234",
      paymentMethod: "electronic",
      category: "credit_card"
    },
    {
      id: "payee4",
      name: "State Farm Insurance",
      accountNumber: "SF123456789",
      address: "789 Insurance Blvd, Cover City, CC 11111",
      paymentMethod: "check",
      category: "insurance"
    },
    {
      id: "payee5",
      name: "Mortgage Lender Corp",
      accountNumber: "ML987654321",
      paymentMethod: "electronic",
      category: "mortgage"
    }
  ]);

  const [bills, setBills] = useState([
    {
      id: "bill1",
      payeeId: "payee1",
      payeeName: "Electric Company",
      accountNumber: "123456789",
      amount: 125.50,
      dueDate: "2025-01-20",
      status: "scheduled",
      recurring: "monthly",
      memo: "Monthly electric bill"
    },
    {
      id: "bill2",
      payeeId: "payee2",
      payeeName: "Water & Sewer Department",
      accountNumber: "WS987654321",
      amount: 89.75,
      dueDate: "2025-01-22",
      status: "scheduled",
      recurring: "monthly"
    },
    {
      id: "bill3",
      payeeId: "payee3",
      payeeName: "Chase Credit Card",
      accountNumber: "4532********1234",
      amount: 450.00,
      dueDate: "2025-01-15",
      status: "pending",
      recurring: "monthly"
    },
    {
      id: "bill4",
      payeeId: "payee4",
      payeeName: "State Farm Insurance",
      accountNumber: "SF123456789",
      amount: 275.00,
      dueDate: "2025-01-25",
      status: "scheduled",
      recurring: "monthly"
    },
    {
      id: "bill5",
      payeeId: "payee5",
      payeeName: "Mortgage Lender Corp",
      accountNumber: "ML987654321",
      amount: 1850.00,
      dueDate: "2025-01-01",
      status: "overdue",
      recurring: "monthly"
    }
  ]);

  const [paymentHistory] = useState([
    {
      id: "txn1",
      payeeId: "payee1",
      payeeName: "Electric Company",
      amount: 118.25,
      date: "2024-12-20T10:30:00Z",
      status: "completed",
      confirmationNumber: "TXN123456789",
      paymentMethod: "electronic"
    },
    {
      id: "txn2",
      payeeId: "payee2",
      payeeName: "Water & Sewer Department",
      amount: 92.50,
      date: "2024-12-22T14:15:00Z",
      status: "completed",
      confirmationNumber: "TXN987654321",
      paymentMethod: "electronic"
    },
    {
      id: "txn3",
      payeeId: "payee3",
      payeeName: "Chase Credit Card",
      amount: 500.00,
      date: "2024-12-15T09:45:00Z",
      status: "completed",
      confirmationNumber: "TXN456789123",
      paymentMethod: "electronic"
    },
    {
      id: "txn4",
      payeeId: "payee4",
      payeeName: "State Farm Insurance",
      amount: 275.00,
      date: "2024-12-25T16:20:00Z",
      status: "pending",
      confirmationNumber: "TXN789123456",
      paymentMethod: "check"
    },
    {
      id: "txn5",
      payeeId: "payee1",
      payeeName: "Electric Company",
      amount: 135.75,
      date: "2024-11-20T11:00:00Z",
      status: "completed",
      confirmationNumber: "TXN321654987",
      paymentMethod: "electronic"
    }
  ]);

  const [autoPaySettings, setAutoPaySettings] = useState([
    {
      payeeId: "payee1",
      enabled: true,
      amountType: "fixed",
      amount: "125.00",
      maxAmount: "200.00",
      daysBefore: "3",
      notifications: {
        email: true,
        sms: false,
        push: true
      }
    },
    {
      payeeId: "payee3",
      enabled: true,
      amountType: "minimum",
      maxAmount: "1000.00",
      daysBefore: "5",
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    }
  ]);

  useEffect(() => {
    // Check for overdue bills and create alerts
    const overdueBills = bills?.filter(bill => bill?.status === 'overdue');
    const dueSoonBills = bills?.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      const today = new Date();
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      return diffDays <= 3 && diffDays >= 0 && bill?.status === 'scheduled';
    });

    const newAlerts = [];

    if (overdueBills?.length > 0) {
      newAlerts?.push({
        id: 'overdue-bills',
        type: 'error',
        title: 'Overdue Bills',
        message: `You have ${overdueBills?.length} overdue bill${overdueBills?.length > 1 ? 's' : ''} that need immediate attention.`,
        action: {
          label: 'View Bills',
          onClick: () => setActiveTab('bills')
        }
      });
    }

    if (dueSoonBills?.length > 0) {
      newAlerts?.push({
        id: 'due-soon',
        type: 'warning',
        title: 'Bills Due Soon',
        message: `${dueSoonBills?.length} bill${dueSoonBills?.length > 1 ? 's are' : ' is'} due within the next 3 days.`,
        action: {
          label: 'Pay Now',
          onClick: () => setActiveTab('bills')
        }
      });
    }

    setAlerts(newAlerts);
  }, [bills]);

  const tabs = [
    { id: 'bills', label: 'Bills', icon: 'Receipt', count: bills?.length },
    { id: 'calendar', label: 'Calendar', icon: 'Calendar' },
    { id: 'history', label: 'History', icon: 'History', count: paymentHistory?.length },
    { id: 'autopay', label: 'AutoPay', icon: 'Repeat', count: autoPaySettings?.filter(s => s?.enabled)?.length }
  ];

  const handleSchedulePayment = async (paymentData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newBill = {
      id: `bill${Date.now()}`,
      payeeId: paymentData?.payeeId,
      payeeName: payees?.find(p => p?.id === paymentData?.payeeId)?.name || '',
      accountNumber: payees?.find(p => p?.id === paymentData?.payeeId)?.accountNumber || '',
      amount: parseFloat(paymentData?.amount),
      dueDate: paymentData?.dueDate,
      status: 'scheduled',
      recurring: paymentData?.recurring,
      memo: paymentData?.memo
    };

    setBills(prev => [...prev, newBill]);
    setShowPaymentForm(false);
    
    setAlerts(prev => [...prev, {
      id: `payment-scheduled-${Date.now()}`,
      type: 'success',
      title: 'Payment Scheduled',
      message: `Payment of $${paymentData?.amount} to ${newBill?.payeeName} has been scheduled for ${new Date(paymentData.dueDate)?.toLocaleDateString()}.`,
      dismissible: true
    }]);
  };

  const handlePayBill = async (bill) => {
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setBills(prev => prev?.map(b => 
      b?.id === bill?.id ? { ...b, status: 'pending' } : b
    ));

    setAlerts(prev => [...prev, {
      id: `payment-processed-${Date.now()}`,
      type: 'success',
      title: 'Payment Processed',
      message: `Payment of $${bill?.amount?.toFixed(2)} to ${bill?.payeeName} is being processed.`,
      dismissible: true
    }]);
  };

  const handleEditBill = (bill) => {
    // Implementation for editing bill
    console.log('Edit bill:', bill);
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to cancel this scheduled payment?')) {
      setBills(prev => prev?.filter(b => b?.id !== billId));
      
      setAlerts(prev => [...prev, {
        id: `payment-cancelled-${Date.now()}`,
        type: 'info',
        title: 'Payment Cancelled',
        message: 'The scheduled payment has been cancelled successfully.',
        dismissible: true
      }]);
    }
  };

  const handleAddPayee = async (payeeData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newPayee = {
      id: `payee${Date.now()}`,
      ...payeeData
    };

    // In a real app, this would update the payees state
    console.log('Add payee:', newPayee);
    
    setAlerts(prev => [...prev, {
      id: `payee-added-${Date.now()}`,
      type: 'success',
      title: 'Payee Added',
      message: `${payeeData?.name} has been added to your payee list.`,
      dismissible: true
    }]);
  };

  const handleEditPayee = async (payeeData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Edit payee:', payeeData);
  };

  const handleDeletePayee = async (payeeId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Delete payee:', payeeId);
  };

  const handleUpdateAutoPaySettings = async (payeeId, settings) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setAutoPaySettings(prev => {
      const existing = prev?.find(s => s?.payeeId === payeeId);
      if (existing) {
        return prev?.map(s => s?.payeeId === payeeId ? { ...s, ...settings } : s);
      } else {
        return [...prev, { payeeId, ...settings }];
      }
    });

    const payeeName = payees?.find(p => p?.id === payeeId)?.name || 'Payee';
    
    setAlerts(prev => [...prev, {
      id: `autopay-updated-${Date.now()}`,
      type: 'success',
      title: 'AutoPay Updated',
      message: `AutoPay settings for ${payeeName} have been ${settings?.enabled ? 'enabled' : 'disabled'}.`,
      dismissible: true
    }]);
  };

  const handleExportHistory = () => {
    // Simulate export functionality
    setAlerts(prev => [...prev, {
      id: `export-${Date.now()}`,
      type: 'info',
      title: 'Export Started',
      message: 'Your payment history is being prepared for download.',
      dismissible: true
    }]);
  };

  const handleViewTransactionDetails = (transaction) => {
    console.log('View transaction details:', transaction);
  };

  const handleLogout = () => {
    window.location.href = '/login';
  };

  const handleExtendSession = () => {
    console.log('Session extended');
  };

  const handleDismissAlert = (alertId) => {
    setAlerts(prev => prev?.filter(alert => alert?.id !== alertId));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onToggleSidebar={() => {}} 
      />
      {/* Session Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Receipt" size={16} color="white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Bill Pay</h1>
                <p className="text-sm text-muted-foreground">Manage your bill payments and schedules</p>
              </div>
            </div>
            <SessionHeader 
              user={user} 
              onLogout={handleLogout}
              onExtendSession={handleExtendSession}
            />
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Breadcrumb */}
        <BreadcrumbTrail customBreadcrumbs={[]} />

        {/* Alerts */}
        {alerts?.length > 0 && (
          <div className="mb-6">
            <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* Quick Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Button
              variant="default"
              onClick={() => setShowPaymentForm(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Schedule Payment
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPayeeManager(true)}
              iconName="Users"
              iconPosition="left"
            >
              Manage Payees
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAutoPaySettings(true)}
              iconName="Repeat"
              iconPosition="left"
            >
              AutoPay Settings
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-sm text-muted-foreground">
              Total Due: <span className="font-semibold text-foreground">
                ${bills?.filter(b => b?.status === 'scheduled' || b?.status === 'overdue')?.reduce((sum, b) => sum + b?.amount, 0)?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border mb-6">
          <nav className="flex space-x-8">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }
                `}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                {tab?.count !== undefined && (
                  <span className={`
                    px-2 py-1 rounded-full text-xs font-medium
                    ${activeTab === tab?.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                  `}>
                    {tab?.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Payment Form Modal */}
          {showPaymentForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
              <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <PaymentForm
                  payees={payees}
                  onSubmit={handleSchedulePayment}
                  onCancel={() => setShowPaymentForm(false)}
                />
              </div>
            </div>
          )}

          {/* Payee Manager Modal */}
          {showPayeeManager && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
              <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <PayeeManager
                  payees={payees}
                  onAddPayee={handleAddPayee}
                  onEditPayee={handleEditPayee}
                  onDeletePayee={handleDeletePayee}
                  onClose={() => setShowPayeeManager(false)}
                />
              </div>
            </div>
          )}

          {/* AutoPay Settings Modal */}
          {showAutoPaySettings && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
              <div className="bg-card rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <AutoPaySettings
                  payees={payees}
                  autoPaySettings={autoPaySettings}
                  onUpdateSettings={handleUpdateAutoPaySettings}
                  onClose={() => setShowAutoPaySettings(false)}
                />
              </div>
            </div>
          )}

          {/* Bills Tab */}
          {activeTab === 'bills' && (
            <BillsList
              bills={bills}
              onPayBill={handlePayBill}
              onEditBill={handleEditBill}
              onDeleteBill={handleDeleteBill}
            />
          )}

          {/* Calendar Tab */}
          {activeTab === 'calendar' && (
            <PaymentCalendar
              bills={bills}
              onSelectDate={setSelectedDate}
              selectedDate={selectedDate}
            />
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <PaymentHistory
              transactions={paymentHistory}
              onExportHistory={handleExportHistory}
              onViewDetails={handleViewTransactionDetails}
            />
          )}

          {/* AutoPay Tab */}
          {activeTab === 'autopay' && (
            <AutoPaySettings
              payees={payees}
              autoPaySettings={autoPaySettings}
              onUpdateSettings={handleUpdateAutoPaySettings}
              onClose={() => {}}
            />
          )}
        </div>
      </div>
      {/* Quick Action Panel */}
      <QuickActionPanel onToggle={() => {}} />
    </div>
  );
};

export default BillPayPage;