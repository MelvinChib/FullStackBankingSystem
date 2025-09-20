import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransactionTable = ({ transactions, onTransactionSelect }) => {
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [expandedRow, setExpandedRow] = useState(null);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedTransactions = [...transactions]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortField === 'amount') {
      aValue = Math.abs(parseFloat(aValue));
      bValue = Math.abs(parseFloat(bValue));
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatAmount = (amount) => {
    const isNegative = amount < 0;
    const formattedAmount = Math.abs(amount)?.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD'
    });
    return isNegative ? `-${formattedAmount}` : formattedAmount;
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return 'ArrowDownLeft';
      case 'withdrawal':
        return 'ArrowUpRight';
      case 'transfer':
        return 'ArrowLeftRight';
      case 'payment':
        return 'Receipt';
      case 'fee':
        return 'AlertCircle';
      case 'interest':
        return 'TrendingUp';
      case 'refund':
        return 'RotateCcw';
      default:
        return 'Circle';
    }
  };

  const getAmountColor = (amount) => {
    return amount >= 0 ? 'text-success' : 'text-error';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success/10 text-success border-success/20', label: 'Completed' },
      pending: { color: 'bg-warning/10 text-warning border-warning/20', label: 'Pending' },
      failed: { color: 'bg-error/10 text-error border-error/20', label: 'Failed' },
      processing: { color: 'bg-primary/10 text-primary border-primary/20', label: 'Processing' }
    };

    const config = statusConfig?.[status] || statusConfig?.completed;
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const toggleRowExpansion = (transactionId) => {
    setExpandedRow(expandedRow === transactionId ? null : transactionId);
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 text-left font-medium text-foreground hover:text-primary transition-colors"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <Icon
          name="ChevronUp"
          size={12}
          className={`${sortField === field && sortDirection === 'asc' ? 'text-primary' : 'text-muted-foreground'}`}
        />
        <Icon
          name="ChevronDown"
          size={12}
          className={`-mt-1 ${sortField === field && sortDirection === 'desc' ? 'text-primary' : 'text-muted-foreground'}`}
        />
      </div>
    </button>
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-4 text-left">
                <SortButton field="date">Date</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="description">Description</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="amount">Amount</SortButton>
              </th>
              <th className="px-6 py-4 text-left">
                <SortButton field="balance">Balance</SortButton>
              </th>
              <th className="px-6 py-4 text-left">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sortedTransactions?.map((transaction) => (
              <React.Fragment key={transaction?.id}>
                <tr className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        transaction?.amount >= 0 ? 'bg-success/10' : 'bg-error/10'
                      }`}>
                        <Icon
                          name={getTransactionIcon(transaction?.type)}
                          size={16}
                          className={transaction?.amount >= 0 ? 'text-success' : 'text-error'}
                        />
                      </div>
                      <span className="text-sm text-foreground">{formatDate(transaction?.date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                      {transaction?.merchant && (
                        <p className="text-xs text-muted-foreground">{transaction?.merchant}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-semibold ${getAmountColor(transaction?.amount)}`}>
                      {formatAmount(transaction?.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-foreground">
                      {formatAmount(transaction?.balance)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(transaction?.status)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleRowExpansion(transaction?.id)}
                    >
                      <Icon
                        name={expandedRow === transaction?.id ? 'ChevronUp' : 'ChevronDown'}
                        size={16}
                      />
                    </Button>
                  </td>
                </tr>
                {expandedRow === transaction?.id && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 bg-muted/20">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-foreground mb-2">Transaction Details</p>
                          <div className="space-y-1">
                            <p><span className="text-muted-foreground">Transaction ID:</span> {transaction?.transactionId}</p>
                            <p><span className="text-muted-foreground">Category:</span> {transaction?.category}</p>
                            {transaction?.reference && (
                              <p><span className="text-muted-foreground">Reference:</span> {transaction?.reference}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Button variant="outline" size="sm" iconName="Download">
                            Receipt
                          </Button>
                          {transaction?.status === 'completed' && transaction?.amount < 0 && (
                            <Button variant="outline" size="sm" iconName="AlertTriangle">
                              Dispute
                            </Button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-border">
        {sortedTransactions?.map((transaction) => (
          <div key={transaction?.id} className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  transaction?.amount >= 0 ? 'bg-success/10' : 'bg-error/10'
                }`}>
                  <Icon
                    name={getTransactionIcon(transaction?.type)}
                    size={18}
                    className={transaction?.amount >= 0 ? 'text-success' : 'text-error'}
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{transaction?.description}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(transaction?.date)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${getAmountColor(transaction?.amount)}`}>
                  {formatAmount(transaction?.amount)}
                </p>
                {getStatusBadge(transaction?.status)}
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                Balance: {formatAmount(transaction?.balance)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleRowExpansion(transaction?.id)}
              >
                <Icon
                  name={expandedRow === transaction?.id ? 'ChevronUp' : 'ChevronDown'}
                  size={16}
                />
                <span className="ml-1">Details</span>
              </Button>
            </div>

            {expandedRow === transaction?.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono text-foreground">{transaction?.transactionId}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Category</p>
                    <p className="text-foreground capitalize">{transaction?.category}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" iconName="Download" className="flex-1">
                    Receipt
                  </Button>
                  {transaction?.status === 'completed' && transaction?.amount < 0 && (
                    <Button variant="outline" size="sm" iconName="AlertTriangle" className="flex-1">
                      Dispute
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {sortedTransactions?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No transactions found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;