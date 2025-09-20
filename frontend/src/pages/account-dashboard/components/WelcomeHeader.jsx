import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const WelcomeHeader = ({ user, lastLogin, onRefreshData, isRefreshing }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime?.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const formatLastLogin = (loginTime) => {
    const date = new Date(loginTime);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else {
      return date?.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit'
      });
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white mb-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Icon name="User" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.firstName || 'User'}!
              </h1>
              <p className="text-white/80 text-sm">
                Welcome back to your BankingHub dashboard
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-white/70">
            <div className="flex items-center space-x-1">
              <Icon name="Clock" size={14} />
              <span>Last login: {formatLastLogin(lastLogin)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Shield" size={14} />
              <span>Secure connection</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{currentTime?.toLocaleDateString('en-US', { 
                weekday: 'long',
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onRefreshData}
            loading={isRefreshing}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            iconName="RefreshCw"
            iconPosition="left"
          >
            Refresh Data
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
            <span className="text-sm text-white/80">Live</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-sm">
              <Icon name="TrendingUp" size={14} />
              <span>Account activity is normal</span>
            </div>
            <div className="flex items-center space-x-1 text-sm">
              <Icon name="Bell" size={14} />
              <span>2 new notifications</span>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-white/60">Current time</p>
            <p className="text-sm font-medium">
              {currentTime?.toLocaleTimeString('en-US', { 
                hour: 'numeric',
                minute: '2-digit',
                timeZoneName: 'short'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeHeader;