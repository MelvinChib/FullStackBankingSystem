import React, { useState } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const AlertBanner = ({ alerts = [], onDismiss }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return 'CheckCircle';
      case 'warning':
        return 'AlertTriangle';
      case 'error':
        return 'XCircle';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getAlertStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-success/10 border-success/20 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'error':
        return 'bg-error/10 border-error/20 text-error';
      case 'info':
      default:
        return 'bg-primary/10 border-primary/20 text-primary';
    }
  };

  const handleDismiss = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
    if (onDismiss) {
      onDismiss(alertId);
    }
  };

  const visibleAlerts = alerts?.filter(alert => !dismissedAlerts?.has(alert?.id));

  if (visibleAlerts?.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {visibleAlerts?.map((alert) => (
        <div
          key={alert?.id}
          className={`flex items-start space-x-3 p-4 border rounded-lg animate-slide-down ${getAlertStyles(alert?.type)}`}
        >
          <div className="flex-shrink-0 mt-0.5">
            <Icon name={getAlertIcon(alert?.type)} size={20} />
          </div>
          
          <div className="flex-1 min-w-0">
            {alert?.title && (
              <h4 className="text-sm font-semibold mb-1">
                {alert?.title}
              </h4>
            )}
            <p className="text-sm">
              {alert?.message}
            </p>
            {alert?.action && (
              <div className="mt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={alert?.action?.onClick}
                  className="text-xs"
                >
                  {alert?.action?.label}
                </Button>
              </div>
            )}
          </div>

          {alert?.dismissible !== false && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDismiss(alert?.id)}
              className="flex-shrink-0 h-6 w-6 -mt-1 -mr-1 hover:bg-black/10"
            >
              <Icon name="X" size={14} />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default AlertBanner;