import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountSummaryCard = ({ account }) => {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = async (text, fieldName) => {
    try {
      await navigator.clipboard?.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatAccountNumber = (number) => {
    return `****${number?.slice(-4)}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{account?.name}</h2>
          <p className="text-sm text-muted-foreground">{account?.type}</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${account?.status === 'active' ? 'bg-success' : 'bg-warning'}`}></div>
          <span className="text-sm text-muted-foreground capitalize">{account?.status}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Current Balance */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Current Balance</p>
          <p className="text-2xl font-bold text-foreground">${account?.currentBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Available Balance */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className="text-xl font-semibold text-success">${account?.availableBalance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        </div>

        {/* Account Number */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Account Number</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-foreground">{formatAccountNumber(account?.accountNumber)}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(account?.accountNumber, 'account')}
              className="h-6 w-6"
            >
              <Icon 
                name={copiedField === 'account' ? 'Check' : 'Copy'} 
                size={14} 
                color={copiedField === 'account' ? 'var(--color-success)' : 'currentColor'}
              />
            </Button>
          </div>
        </div>

        {/* Routing Number */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">Routing Number</p>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono text-foreground">{account?.routingNumber}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleCopy(account?.routingNumber, 'routing')}
              className="h-6 w-6"
            >
              <Icon 
                name={copiedField === 'routing' ? 'Check' : 'Copy'} 
                size={14} 
                color={copiedField === 'routing' ? 'var(--color-success)' : 'currentColor'}
              />
            </Button>
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border">
        <Button variant="default" size="sm" iconName="ArrowLeftRight" iconPosition="left">
          Transfer Funds
        </Button>
        <Button variant="outline" size="sm" iconName="Receipt" iconPosition="left">
          Pay Bills
        </Button>
        <Button variant="outline" size="sm" iconName="Download" iconPosition="left">
          Download Statement
        </Button>
        <Button variant="outline" size="sm" iconName="CreditCard" iconPosition="left">
          Manage Cards
        </Button>
      </div>
    </div>
  );
};

export default AccountSummaryCard;