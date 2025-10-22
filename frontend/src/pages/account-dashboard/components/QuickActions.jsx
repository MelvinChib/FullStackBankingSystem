import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const QuickActions = ({ onActionClick }) => {
  const quickActions = [
    {
      id: 'transfer',
      label: 'Transfer Funds',
      description: 'Move money between accounts',
      icon: 'ArrowLeftRight',
      color: 'bg-primary',
      path: '/transfer-funds'
    },
    {
      id: 'pay-bill',
      label: 'Pay Bills',
      description: 'Pay your bills instantly',
      icon: 'Receipt',
      color: 'bg-secondary',
      path: '/bill-pay'
    },
    {
      id: 'mobile-deposit',
      label: 'Mobile Deposit',
      description: 'Deposit checks with camera',
      icon: 'Camera',
      color: 'bg-accent',
      path: '/mobile-deposit'
    },
    {
      id: 'view-statements',
      label: 'View Statements',
      description: 'Download account statements',
      icon: 'FileText',
      color: 'bg-success',
      path: '/statements'
    }
  ];

  const handleActionClick = (action) => {
    if (onActionClick) {
      onActionClick(action);
    }
    // Navigate to the action path
    window.location.href = action?.path;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
        <p className="text-sm text-muted-foreground">Common banking tasks</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickActions?.map((action) => (
          <button
            key={action?.id}
            onClick={() => handleActionClick(action)}
            className="flex flex-col items-center space-y-3 p-4 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all duration-200 group"
          >
            <div className={`w-12 h-12 ${action?.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
              <Icon name={action?.icon} size={20} color="white" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                {action?.label}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {action?.description}
              </p>
            </div>
          </button>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Need help?</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.href = '/support'}
            iconName="MessageCircle"
            iconPosition="left"
          >
            Contact Support
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuickActions;