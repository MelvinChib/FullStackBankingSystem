import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../../components/ui/Header';
import SessionHeader from '../../components/ui/SessionHeader';
import AlertBanner from '../../components/ui/AlertBanner';
import BreadcrumbTrail from '../../components/ui/BreadcrumbTrail';
import QuickActionPanel from '../../components/ui/QuickActionPanel';
import TransferForm from './components/TransferForm';
import RecentTransfers from './components/RecentTransfers';
import TransferConfirmation from './components/TransferConfirmation';
import TransferSuccess from './components/TransferSuccess';
import Icon from '../../components/AppIcon';

const TransferFunds = () => {
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState('form'); // form, confirm, success
  const [transferData, setTransferData] = useState(null);
  const [transferResult, setTransferResult] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [quickActionOpen, setQuickActionOpen] = useState(false);

  // Mock user data
  const user = {
    id: 'user_001',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com'
  };

  // Mock accounts data
  const accounts = [
    {
      id: 'acc_001',
      name: 'Primary Checking',
      accountNumber: '****1234',
      type: 'checking',
      balance: 15420.50,
      available: 15420.50
    },
    {
      id: 'acc_002',
      name: 'High Yield Savings',
      accountNumber: '****5678',
      type: 'savings',
      balance: 45280.75,
      available: 45280.75
    },
    {
      id: 'acc_003',
      name: 'Business Checking',
      accountNumber: '****9012',
      type: 'business',
      balance: 8750.25,
      available: 8750.25
    }
  ];

  // Mock beneficiaries data
  const beneficiaries = [
    {
      id: 'ben_001',
      name: 'John Smith',
      nickname: 'John - Rent Payment',
      bankName: 'Chase Bank',
      accountNumber: '****4567',
      routingNumber: '021000021',
      type: 'external'
    },
    {
      id: 'ben_002',
      name: 'Emily Davis',
      nickname: 'Emily - Personal',
      bankName: 'Bank of America',
      accountNumber: '****8901',
      routingNumber: '011401533',
      type: 'external'
    },
    {
      id: 'ben_003',
      name: 'Michael Brown',
      nickname: 'Mike - Business',
      bankName: 'Wells Fargo',
      accountNumber: '****2345',
      routingNumber: '121000248',
      type: 'wire'
    }
  ];

  // Mock recent transfers data
  const recentTransfers = [
    {
      id: 'txn_001',
      fromAccount: 'Primary Checking',
      toAccount: 'High Yield Savings',
      amount: 1000.00,
      fee: 0,
      type: 'internal',
      status: 'completed',
      date: '2025-01-12T10:30:00Z',
      description: 'Monthly savings transfer',
      frequency: 'monthly',
      referenceNumber: 'TXN001234567',
      nextDate: '2025-02-12T10:30:00Z'
    },
    {
      id: 'txn_002',
      fromAccount: 'Primary Checking',
      toAccount: 'John - Rent Payment',
      amount: 2500.00,
      fee: 3.00,
      type: 'external',
      status: 'pending',
      date: '2025-01-13T14:15:00Z',
      description: 'January rent payment',
      frequency: 'once',
      referenceNumber: 'TXN001234568'
    },
    {
      id: 'txn_003',
      fromAccount: 'Business Checking',
      toAccount: 'Mike - Business',
      amount: 5000.00,
      fee: 25.00,
      type: 'wire',
      status: 'scheduled',
      date: '2025-01-15T09:00:00Z',
      description: 'Vendor payment',
      frequency: 'once',
      referenceNumber: 'TXN001234569'
    },
    {
      id: 'txn_004',
      fromAccount: 'Primary Checking',
      toAccount: 'Emily - Personal',
      amount: 750.00,
      fee: 3.00,
      type: 'external',
      status: 'failed',
      date: '2025-01-11T16:45:00Z',
      description: 'Gift transfer',
      frequency: 'once',
      referenceNumber: 'TXN001234570',
      failureReason: 'Insufficient funds at time of processing'
    },
    {
      id: 'txn_005',
      fromAccount: 'High Yield Savings',
      toAccount: 'Primary Checking',
      amount: 2000.00,
      fee: 0,
      type: 'internal',
      status: 'completed',
      date: '2025-01-10T11:20:00Z',
      description: 'Emergency fund withdrawal',
      frequency: 'once',
      referenceNumber: 'TXN001234571'
    }
  ];

  useEffect(() => {
    // Set initial alerts
    const initialAlerts = [
      {
        id: 'alert_001',
        type: 'info',
        title: 'Transfer Limits',
        message: 'Daily transfer limit: ZMW 10,000 | Monthly limit: ZMW 50,000',
        dismissible: true
      }
    ];

    // Add maintenance alert if needed
    const now = new Date();
    const maintenanceStart = new Date('2025-01-14T02:00:00Z');
    const maintenanceEnd = new Date('2025-01-14T04:00:00Z');

    if (now >= maintenanceStart && now <= maintenanceEnd) {
      initialAlerts?.unshift({
        id: 'alert_002',
        type: 'warning',
        title: 'Scheduled Maintenance',
        message: 'External transfers may be delayed during maintenance window (02:00 - 04:00)',
        dismissible: false
      });
    }

    setAlerts(initialAlerts);
  }, []);

  const handleTransfer = (formData) => {
    // Enhance form data with account names
    const fromAccount = accounts?.find(acc => acc?.id === formData?.fromAccount);
    const toAccount = formData?.transferType === 'internal' 
      ? accounts?.find(acc => acc?.id === formData?.toAccount)
      : beneficiaries?.find(ben => ben?.id === formData?.beneficiaryId);

    const enhancedData = {
      ...formData,
      fromAccountName: fromAccount ? `${fromAccount?.name} (${fromAccount?.accountNumber})` : '',
      toAccountName: toAccount ? (toAccount?.nickname || toAccount?.name) : '',
      timestamp: new Date()?.toISOString()
    };

    setTransferData(enhancedData);
    setCurrentStep('confirm');
  };

  const handleConfirmTransfer = (confirmedData) => {
    // Generate transfer result
    const result = {
      ...confirmedData,
      referenceNumber: `TXN${Date.now()}`,
      status: confirmedData?.transferType === 'internal' ? 'completed' : 'pending',
      processedAt: new Date()?.toISOString()
    };

    setTransferResult(result);
    setCurrentStep('success');

    // Add success alert
    setAlerts(prev => [{
      id: `alert_${Date.now()}`,
      type: 'success',
      title: 'Transfer Successful',
      message: `Your ${result?.transferType} transfer of ZMW ${parseFloat(result?.amount)?.toLocaleString()} has been processed.`,
      dismissible: true
    }, ...prev]);
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleCancelTransfer = () => {
    setCurrentStep('form');
    setTransferData(null);
  };

  const handleNewTransfer = () => {
    setCurrentStep('form');
    setTransferData(null);
    setTransferResult(null);
  };

  const handleViewDashboard = () => {
    window.location.href = '/account-dashboard';
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

  const handleCancelScheduledTransfer = (transfer) => {
    setAlerts(prev => [{
      id: `alert_${Date.now()}`,
      type: 'info',
      title: 'Transfer Cancelled',
      message: `Scheduled transfer of $${transfer?.amount?.toLocaleString()} has been cancelled.`,
      dismissible: true
    }, ...prev]);
  };

  const handleModifyTransfer = (transfer) => {
    setAlerts(prev => [{
      id: `alert_${Date.now()}`,
      type: 'info',
      title: 'Modify Transfer',
      message: 'Transfer modification feature will be available soon.',
      dismissible: true
    }, ...prev]);
  };

  const handleAddBeneficiary = () => {
    setAlerts(prev => [{
      id: `alert_${Date.now()}`,
      type: 'info',
      title: 'Add Beneficiary',
      message: 'Beneficiary management feature will be available soon.',
      dismissible: true
    }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header user={user} onLogout={handleLogout} onToggleSidebar={() => {}} />
      {/* Session Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="ArrowLeftRight" size={20} className="text-primary" />
                <span className="text-sm font-medium text-foreground">Transfer Funds</span>
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
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <BreadcrumbTrail customBreadcrumbs={[
          { label: 'Dashboard', href: '/account-dashboard' },
          { label: 'Transfer Funds', href: '/transfer-funds', current: true }
        ]} />

        {/* Alerts */}
        {alerts?.length > 0 && (
          <div className="mb-6">
            <AlertBanner alerts={alerts} onDismiss={handleDismissAlert} />
          </div>
        )}

        {/* Content based on current step */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {currentStep === 'form' && (
              <TransferForm
                accounts={accounts}
                beneficiaries={beneficiaries}
                onTransfer={handleTransfer}
                onAddBeneficiary={handleAddBeneficiary}
              />
            )}

            {currentStep === 'confirm' && transferData && (
              <TransferConfirmation
                transferData={transferData}
                onConfirm={handleConfirmTransfer}
                onCancel={handleCancelTransfer}
                onBack={handleBackToForm}
              />
            )}

            {currentStep === 'success' && transferResult && (
              <TransferSuccess
                transferResult={transferResult}
                onNewTransfer={handleNewTransfer}
                onViewDashboard={handleViewDashboard}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {currentStep === 'form' && (
              <RecentTransfers
                transfers={recentTransfers}
                onCancelTransfer={handleCancelScheduledTransfer}
                onModifyTransfer={handleModifyTransfer}
              />
            )}

            {(currentStep === 'confirm' || currentStep === 'success') && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Transfer Progress</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                      <Icon name="Check" size={16} color="white" />
                    </div>
                    <span className="text-sm text-foreground">Transfer Details</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'confirm' || currentStep === 'success' ?'bg-success' : 'bg-muted'
                    }`}>
                      <Icon name="Check" size={16} color="white" />
                    </div>
                    <span className="text-sm text-foreground">Confirmation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      currentStep === 'success' ? 'bg-success' : 'bg-muted'
                    }`}>
                      <Icon name="Check" size={16} color="white" />
                    </div>
                    <span className="text-sm text-foreground">Complete</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Quick Action Panel */}
      <QuickActionPanel
        isOpen={quickActionOpen}
        onToggle={setQuickActionOpen}
        recentActions={[
          { label: 'Transfer to Savings', timestamp: new Date() },
          { label: 'Pay Rent', timestamp: new Date() },
          { label: 'Wire Transfer', timestamp: new Date() }
        ]}
      />
    </div>
  );
};

export default TransferFunds;