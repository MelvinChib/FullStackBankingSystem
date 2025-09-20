import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BillsList = ({ bills, onPayBill, onEditBill, onDeleteBill }) => {
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filterStatus, setFilterStatus] = useState('all');

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-success bg-success/10';
      case 'pending':
        return 'text-warning bg-warning/10';
      case 'overdue':
        return 'text-error bg-error/10';
      case 'scheduled':
        return 'text-primary bg-primary/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'overdue':
        return 'AlertTriangle';
      case 'scheduled':
        return 'Calendar';
      default:
        return 'Circle';
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const sortedAndFilteredBills = bills?.filter(bill => filterStatus === 'all' || bill?.status === filterStatus)?.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'dueDate':
          aValue = new Date(a.dueDate);
          bValue = new Date(b.dueDate);
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

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (bills?.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Receipt" size={24} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Bills Found</h3>
        <p className="text-muted-foreground mb-4">
          You haven't scheduled any bill payments yet.
        </p>
        <Button variant="outline" iconName="Plus" iconPosition="left">
          Schedule Your First Payment
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg">
      {/* Header with filters and sorting */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Upcoming Bills</h2>
            <p className="text-sm text-muted-foreground">
              {sortedAndFilteredBills?.length} bill{sortedAndFilteredBills?.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e?.target?.value)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
      </div>
      {/* Bills list */}
      <div className="divide-y divide-border">
        {/* Header row for desktop */}
        <div className="hidden md:grid md:grid-cols-12 gap-4 p-4 text-sm font-medium text-muted-foreground bg-muted/50">
          <div className="col-span-3">
            <button
              onClick={() => handleSort('payee')}
              className="flex items-center space-x-1 hover:text-foreground"
            >
              <span>Payee</span>
              <Icon name="ArrowUpDown" size={14} />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort('dueDate')}
              className="flex items-center space-x-1 hover:text-foreground"
            >
              <span>Due Date</span>
              <Icon name="ArrowUpDown" size={14} />
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => handleSort('amount')}
              className="flex items-center space-x-1 hover:text-foreground"
            >
              <span>Amount</span>
              <Icon name="ArrowUpDown" size={14} />
            </button>
          </div>
          <div className="col-span-2">Status</div>
          <div className="col-span-3">Actions</div>
        </div>

        {sortedAndFilteredBills?.map((bill) => {
          const daysUntilDue = getDaysUntilDue(bill?.dueDate);
          
          return (
            <div key={bill?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
              {/* Mobile layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
                      <Icon name="Building2" size={16} color="white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{bill?.payeeName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {bill?.accountNumber && `Account: ${bill?.accountNumber}`}
                      </p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill?.status)}`}>
                    <div className="flex items-center space-x-1">
                      <Icon name={getStatusIcon(bill?.status)} size={12} />
                      <span className="capitalize">{bill?.status}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">
                      ${bill?.amount?.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due {formatDate(bill?.dueDate)}
                      {daysUntilDue === 0 && ' (Today)'}
                      {daysUntilDue === 1 && ' (Tomorrow)'}
                      {daysUntilDue > 1 && ` (${daysUntilDue} days)`}
                      {daysUntilDue < 0 && ` (${Math.abs(daysUntilDue)} days overdue)`}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {bill?.status === 'scheduled' && (
                      <Button
                        size="sm"
                        onClick={() => onPayBill(bill)}
                        iconName="CreditCard"
                        iconPosition="left"
                      >
                        Pay Now
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditBill(bill)}
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
              {/* Desktop layout */}
              <div className="hidden md:grid md:grid-cols-12 gap-4 items-center">
                <div className="col-span-3 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name="Building2" size={14} color="white" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{bill?.payeeName}</p>
                    <p className="text-xs text-muted-foreground">
                      {bill?.accountNumber && `Account: ${bill?.accountNumber}`}
                    </p>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-foreground">{formatDate(bill?.dueDate)}</p>
                  <p className="text-xs text-muted-foreground">
                    {daysUntilDue === 0 && 'Due today'}
                    {daysUntilDue === 1 && 'Due tomorrow'}
                    {daysUntilDue > 1 && `${daysUntilDue} days left`}
                    {daysUntilDue < 0 && `${Math.abs(daysUntilDue)} days overdue`}
                  </p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm font-medium text-foreground">
                    ${bill?.amount?.toFixed(2)}
                  </p>
                  {bill?.recurring && bill?.recurring !== 'none' && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {bill?.recurring} payment
                    </p>
                  )}
                </div>
                
                <div className="col-span-2">
                  <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(bill?.status)}`}>
                    <Icon name={getStatusIcon(bill?.status)} size={12} />
                    <span className="capitalize">{bill?.status}</span>
                  </div>
                </div>
                
                <div className="col-span-3 flex items-center justify-end space-x-2">
                  {bill?.status === 'scheduled' && (
                    <Button
                      size="sm"
                      onClick={() => onPayBill(bill)}
                      iconName="CreditCard"
                      iconPosition="left"
                    >
                      Pay Now
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEditBill(bill)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteBill(bill?.id)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BillsList;