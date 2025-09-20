import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionPanel = ({ isOpen = false, onToggle, recentActions = [] }) => {
  const [isExpanded, setIsExpanded] = useState(isOpen);
  const location = useLocation();

  const quickActions = [
    {
      id: 'transfer',
      label: 'Quick Transfer',
      icon: 'ArrowLeftRight',
      path: '/transfer-funds',
      description: 'Transfer money between accounts',
      color: 'bg-primary',
    },
    {
      id: 'pay-bill',
      label: 'Pay Bill',
      icon: 'Receipt',
      path: '/bill-pay',
      description: 'Pay your bills instantly',
      color: 'bg-secondary',
    },
    {
      id: 'deposit',
      label: 'Mobile Deposit',
      icon: 'Camera',
      path: '/mobile-deposit',
      description: 'Deposit checks with your camera',
      color: 'bg-accent',
    },
    {
      id: 'budget',
      label: 'Check Budget',
      icon: 'PieChart',
      path: '/budget-tracker',
      description: 'View your spending insights',
      color: 'bg-success',
    },
  ];

  const getContextualActions = () => {
    const currentPath = location?.pathname;
    
    // Filter out actions for current page
    return quickActions?.filter(action => action?.path !== currentPath);
  };

  const handleActionClick = (action) => {
    window.location.href = action?.path;
    if (onToggle) onToggle(false);
  };

  const togglePanel = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (onToggle) onToggle(newState);
  };

  return (
    <>
      {/* Desktop Floating Panel */}
      <div className="hidden lg:block fixed right-6 top-1/2 transform -translate-y-1/2 z-200">
        <div className={`transition-all duration-300 ${isExpanded ? 'w-80' : 'w-14'}`}>
          {/* Toggle Button */}
          <Button
            variant="default"
            size="icon"
            onClick={togglePanel}
            className="w-14 h-14 rounded-full shadow-lg mb-4 bg-primary hover:bg-primary/90"
          >
            <Icon name={isExpanded ? 'X' : 'Zap'} size={20} color="white" />
          </Button>

          {/* Expanded Panel */}
          {isExpanded && (
            <div className="bg-card border border-border rounded-lg shadow-lg p-4 animate-slide-down">
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground mb-1">Quick Actions</h3>
                <p className="text-xs text-muted-foreground">Common banking tasks</p>
              </div>

              <div className="space-y-2">
                {getContextualActions()?.map((action) => (
                  <button
                    key={action?.id}
                    onClick={() => handleActionClick(action)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors duration-200 text-left"
                  >
                    <div className={`w-8 h-8 ${action?.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon name={action?.icon} size={16} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{action?.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{action?.description}</p>
                    </div>
                  </button>
                ))}
              </div>

              {recentActions?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-xs font-medium text-muted-foreground mb-2">Recent Actions</h4>
                  <div className="space-y-1">
                    {recentActions?.slice(0, 3)?.map((action, index) => (
                      <div key={index} className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <Icon name="Clock" size={12} />
                        <span className="truncate">{action?.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Mobile Bottom Sheet */}
      <div className="lg:hidden">
        {/* Mobile FAB */}
        <Button
          variant="default"
          size="icon"
          onClick={togglePanel}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-200 bg-primary hover:bg-primary/90"
        >
          <Icon name="Zap" size={20} color="white" />
        </Button>

        {/* Mobile Bottom Sheet */}
        {isExpanded && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-250"
              onClick={() => setIsExpanded(false)}
            />
            <div className="fixed bottom-0 left-0 right-0 bg-card rounded-t-xl shadow-lg z-300 animate-slide-down">
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                    <p className="text-sm text-muted-foreground">Choose an action</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsExpanded(false)}
                  >
                    <Icon name="X" size={20} />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {getContextualActions()?.map((action) => (
                    <button
                      key={action?.id}
                      onClick={() => handleActionClick(action)}
                      className="flex flex-col items-center space-y-2 p-4 rounded-lg hover:bg-muted transition-colors duration-200"
                    >
                      <div className={`w-12 h-12 ${action?.color} rounded-lg flex items-center justify-center`}>
                        <Icon name={action?.icon} size={20} color="white" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-foreground">{action?.label}</p>
                        <p className="text-xs text-muted-foreground">{action?.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default QuickActionPanel;