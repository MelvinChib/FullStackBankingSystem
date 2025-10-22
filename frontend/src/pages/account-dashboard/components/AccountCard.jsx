import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountCard = ({ account, onViewDetails, onQuickAction }) => {
  const getAccountIcon = (type) => {
    switch (type) {
      case 'checking':
        return 'CreditCard';
      case 'savings':
        return 'PiggyBank';
      case 'credit':
        return 'CreditCard';
      default:
        return 'Wallet';
    }
  };

  const getAccountColor = (type) => {
    switch (type) {
      case 'checking':
        return 'bg-primary';
      case 'savings':
        return 'bg-success';
      case 'credit':
        return 'bg-secondary';
      default:
        return 'bg-muted';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const isLowBalance = account?.balance < 100 && account?.type !== 'credit';
  const isHighUtilization = account?.type === 'credit' && (account?.balance / account?.creditLimit) > 0.8;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 ${getAccountColor(account?.type)} rounded-lg flex items-center justify-center`}>
            <Icon name={getAccountIcon(account?.type)} size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{account?.name}</h3>
            <p className="text-sm text-muted-foreground">****{account?.accountNumber?.slice(-4)}</p>
          </div>
        </div>
        
        {account?.type === 'credit' && (
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Available Credit</p>
            <p className="text-sm font-medium text-success">
              {formatCurrency(account?.creditLimit - account?.balance)}
            </p>
          </div>
        )}
      </div>
      <div className="mb-4">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              {account?.type === 'credit' ? 'Current Balance' : 'Available Balance'}
            </p>
            <p className={`text-2xl font-bold ${
              account?.type === 'credit' 
                ? account?.balance > 0 ? 'text-error': 'text-success' : isLowBalance ?'text-warning' : 'text-foreground'
            }`}>
              {formatCurrency(account?.balance)}
            </p>
          </div>
          
          {account?.type === 'credit' && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Credit Limit</p>
              <p className="text-sm font-medium text-foreground">
                {formatCurrency(account?.creditLimit)}
              </p>
            </div>
          )}
        </div>

        {(isLowBalance || isHighUtilization) && (
          <div className={`flex items-center space-x-1 mt-2 text-xs ${
            isLowBalance ? 'text-warning' : 'text-error'
          }`}>
            <Icon name="AlertTriangle" size={12} />
            <span>
              {isLowBalance ? 'Low balance alert' : 'High credit utilization'}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Icon name="Activity" size={12} />
          <span>Last activity: {account?.lastActivity}</span>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(account)}
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => onQuickAction(account)}
          >
            Quick Action
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountCard;