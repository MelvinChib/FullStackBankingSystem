import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransactions = ({ transactions, onViewAll, onSearchTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(Math.abs(amount));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday?.setDate(yesterday?.getDate() - 1);

    if (date?.toDateString() === today?.toDateString()) {
      return 'Today';
    } else if (date?.toDateString() === yesterday?.toDateString()) {
      return 'Yesterday';
    } else {
      return date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getTransactionIcon = (category) => {
    const iconMap = {
      'transfer': 'ArrowLeftRight',
      'payment': 'CreditCard',
      'deposit': 'TrendingUp',
      'withdrawal': 'TrendingDown',
      'bill': 'Receipt',
      'shopping': 'ShoppingBag',
      'food': 'Coffee',
      'gas': 'Car',
      'entertainment': 'Film',
      'healthcare': 'Heart',
      'other': 'DollarSign'
    };
    return iconMap?.[category] || 'DollarSign';
  };

  const getTransactionColor = (amount) => {
    return amount > 0 ? 'text-success' : 'text-foreground';
  };

  const filteredTransactions = transactions?.filter(transaction =>
    transaction?.description?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
    transaction?.merchant?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  );

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Recent Transactions</h2>
          <p className="text-sm text-muted-foreground">Your latest account activity</p>
        </div>
        <Button
          variant="outline"
          onClick={onViewAll}
          iconName="ExternalLink"
          iconPosition="right"
        >
          View All
        </Button>
      </div>
      <div className="mb-4">
        <div className="relative">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e?.target?.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
          />
        </div>
      </div>
      <div className="space-y-3">
        {filteredTransactions?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No transactions found</p>
          </div>
        ) : (
          filteredTransactions?.slice(0, 10)?.map((transaction) => (
            <div
              key={transaction?.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon 
                  name={getTransactionIcon(transaction?.category)} 
                  size={16} 
                  className="text-muted-foreground" 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-foreground truncate">
                    {transaction?.description}
                  </p>
                  <p className={`text-sm font-semibold ${getTransactionColor(transaction?.amount)}`}>
                    {transaction?.amount > 0 ? '+' : '-'}{formatCurrency(transaction?.amount)}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {transaction?.merchant}
                  </p>
                  <div className="flex items-center space-x-2">
                    {transaction?.pending && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-warning/10 text-warning">
                        Pending
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction?.date)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {filteredTransactions?.length > 10 && (
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            fullWidth
            onClick={onViewAll}
            iconName="ChevronDown"
            iconPosition="right"
          >
            Show More Transactions
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTransactions;