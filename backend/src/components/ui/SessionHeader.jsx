import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const SessionHeader = ({ 
  user, 
  sessionTimeout = 1800, // 30 minutes in seconds
  onLogout,
  onExtendSession 
}) => {
  const [timeLeft, setTimeLeft] = useState(sessionTimeout);
  const [showWarning, setShowWarning] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (onLogout) onLogout();
          return 0;
        }
        
        // Show warning when 5 minutes left
        if (prev <= 300 && !showWarning) {
          setShowWarning(true);
        }
        
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onLogout, showWarning]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleExtendSession = () => {
    setTimeLeft(sessionTimeout);
    setShowWarning(false);
    if (onExtendSession) onExtendSession();
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) onLogout();
  };

  return (
    <>
      <div className="flex items-center space-x-4 text-sm">
        {/* Security Indicator */}
        <div className="flex items-center space-x-1 text-success">
          <Icon name="Shield" size={16} />
          <span className="hidden sm:inline">Secure</span>
        </div>

        {/* Session Timer */}
        <div className={`flex items-center space-x-1 ${timeLeft <= 300 ? 'text-warning' : 'text-muted-foreground'}`}>
          <Icon name="Clock" size={16} />
          <span className="font-mono">{formatTime(timeLeft)}</span>
        </div>

        {/* User Info */}
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
            <Icon name="User" size={12} color="white" />
          </div>
          <span className="hidden md:inline font-medium">
            {user?.name || 'User'}
          </span>
        </div>

        {/* Logout Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogoutClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Icon name="LogOut" size={16} />
          <span className="hidden sm:inline ml-1">Sign Out</span>
        </Button>
      </div>

      {/* Session Warning Modal */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Session Expiring</h3>
                <p className="text-sm text-muted-foreground">
                  Your session will expire in {formatTime(timeLeft)}
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-6">
              For your security, you'll be automatically signed out due to inactivity. 
              Would you like to extend your session?
            </p>
            <div className="flex space-x-3">
              <Button
                variant="default"
                onClick={handleExtendSession}
                className="flex-1"
              >
                Extend Session
              </Button>
              <Button
                variant="outline"
                onClick={confirmLogout}
                className="flex-1"
              >
                Sign Out Now
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Icon name="LogOut" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Confirm Sign Out</h3>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to sign out?
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-6">
              You'll need to sign in again to access your account.
            </p>
            <div className="flex space-x-3">
              <Button
                variant="destructive"
                onClick={confirmLogout}
                className="flex-1"
              >
                Yes, Sign Out
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionHeader;