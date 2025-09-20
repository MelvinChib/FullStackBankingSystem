import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentHistory = ({ transactions, onExportHistory, onViewDetails }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDateRange, setFilterDateRange] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'failed':
        return 'text-error bg-error/10';
      case 'cancelled':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      case 'cancelled':
        return 'Ban';
      default:
        return 'Circle';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'electronic':
        return 'Zap';
      case 'check':
        return 'FileText';
      case 'wire':
        return 'ArrowRightLeft';
      default:
        return 'CreditCard';
    }
  };

  const filterTransactionsByDateRange = (transactions, range) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (range) {
      case 'today':
        return transactions?.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= today;
        });
      case 'week':
        const weekStart = new Date(today);
        weekStart?.setDate(today?.getDate() - today?.getDay());
        return transactions?.filter(t => new Date(t.date) >= weekStart);
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        return transactions?.filter(t => new Date(t.date) >= monthStart);
      case 'quarter':
        const quarterStart = new Date(today.getFullYear(), Math.floor(today.getMonth() / 3) * 3, 1);
        return transactions?.filter(t => new Date(t.date) >= quarterStart);
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        return transactions?.filter(t => new Date(t.date) >= yearStart);
      default:
        return transactions;
    }
  };

  const filteredTransactions = transactions?.filter(transaction => {
      const matchesSearch = transaction?.payeeName?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
                           transaction?.confirmationNumber?.toLowerCase()?.includes(searchTerm?.toLowerCase());
      const matchesStatus = filterStatus === 'all' || transaction?.status === filterStatus;
      return matchesSearch && matchesStatus;
    })?.filter(transaction => filterTransactionsByDateRange([transaction], filterDateRange)?.length > 0)?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.date);
          bValue = new Date(b.date);
          break;
        case 'amount':
          aValue = a?.amount;
          bValue = b?.amount;
          break;
        case 'payee':
          aValue = a?.payeeName?.toLowerCase();
          bValue = b?.payeeName?.toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalAmount = filteredTransactions?.filter(t => t?.status === 'completed')?.reduce((sum, t) => sum + t?.amount, 0);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString)?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (transactions?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="History" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Payment History</h3>
        <p className="text-muted-foreground">
          Your completed payments will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="History" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Payment History</h2>
              <p className="text-sm text-muted-foreground">
                {filteredTransactions?.length} transaction{filteredTransactions?.length !== 1 ? 's' : ''} • 
                Total: ${totalAmount?.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onExportHistory}
              iconName="Download"
              iconPosition="left"
              size="sm"
            >
              Export
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Input
            type="search"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="md:col-span-2"
          />
          
          <Select
            placeholder="Filter by status"
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
          />
          
          <Select
            placeholder="Date range"
            options={dateRangeOptions}
            value={filterDateRange}
            onChange={setFilterDateRange}
          />
        </div>
      </div>
      {/* Transactions list */}
      <div className="divide-y divide-border">
        {filteredTransactions?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">No transactions match your filters.</p>
          </div>
        ) : (
          filteredTransactions?.map((transaction) => (
            <div key={transaction?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
              {/* Mobile layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Icon name={getPaymentMethodIcon(transaction?.paymentMethod)} size={16} color="white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{transaction?.payeeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {transaction?.confirmationNumber}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                    <div className="flex items-center space-x-1">
                      <Icon name={getStatusIcon(transaction?.status)} size={12} />
                      <span className="capitalize">{transaction?.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      ${transaction?.amount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction?.date)} at {formatTime(transaction?.date)}
                    </p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails && onViewDetails(transaction)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    Details
                  </Button>
                </div>
              </div>

              {/* Desktop layout */}
              <div className="hidden md:flex md:items-center md:justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name={getPaymentMethodIcon(transaction?.paymentMethod)} size={16} color="white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">{transaction?.payeeName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {transaction?.confirmationNumber} • {formatDate(transaction?.date)} at {formatTime(transaction?.date)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="font-semibold text-foreground">${transaction?.amount?.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {transaction?.paymentMethod?.replace('_', ' ')}
                    </p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction?.status)}`}>
                    <div className="flex items-center space-x-1">
                      <Icon name={getStatusIcon(transaction?.status)} size={12} />
                      <span className="capitalize">{transaction?.status}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails && onViewDetails(transaction)}
                    iconName="Eye"
                    iconPosition="left"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;