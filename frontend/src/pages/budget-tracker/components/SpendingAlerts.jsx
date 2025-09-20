import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const SpendingAlerts = ({ alerts, onUpdateAlert, onCreateAlert }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    name: '',
    category: '',
    threshold: '',
    type: 'percentage',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  });

  const alertTypes = [
    { id: 'percentage', label: 'Percentage of Budget', icon: 'Percent' },
    { id: 'amount', label: 'Fixed Amount', icon: 'DollarSign' },
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'critical':
        return 'AlertCircle';
      case 'info':
        return 'Info';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning';
      case 'critical':
        return 'text-error';
      case 'info':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleCreateAlert = (e) => {
    e?.preventDefault();
    onCreateAlert({
      ...newAlert,
      id: Date.now(),
      threshold: parseFloat(newAlert?.threshold),
      isActive: true,
      lastTriggered: null,
    });
    setNewAlert({
      name: '',
      category: '',
      threshold: '',
      type: 'percentage',
      notifications: {
        email: true,
        push: true,
        sms: false,
      },
    });
    setShowCreateForm(false);
  };

  const handleToggleAlert = (alertId, isActive) => {
    onUpdateAlert(alertId, { isActive });
  };

  const formatThreshold = (alert) => {
    if (alert?.type === 'percentage') {
      return `${alert?.threshold}% of budget`;
    }
    return `$${alert?.threshold?.toLocaleString()}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Spending Alerts</h3>
          <p className="text-sm text-muted-foreground">
            Get notified when you approach budget limits
          </p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          onClick={() => setShowCreateForm(true)}
        >
          Create Alert
        </Button>
      </div>
      <div className="space-y-4">
        {alerts?.map((alert) => (
          <div
            key={alert?.id}
            className={`border rounded-lg p-4 transition-colors duration-200 ${
              alert?.isActive ? 'border-border' : 'border-muted bg-muted/50'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${
                  alert?.isActive ? 'bg-primary' : 'bg-muted-foreground'
                } rounded-lg flex items-center justify-center`}>
                  <Icon name={getAlertIcon(alert?.severity)} size={20} color="white" />
                </div>
                <div>
                  <h4 className={`font-semibold ${
                    alert?.isActive ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {alert?.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {alert?.category} • {formatThreshold(alert)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  alert?.isActive 
                    ? 'bg-success/10 text-success' :'bg-muted text-muted-foreground'
                }`}>
                  {alert?.isActive ? 'Active' : 'Inactive'}
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={alert?.isActive}
                    onChange={(e) => handleToggleAlert(alert?.id, e?.target?.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Notifications:</span>
                <div className="flex space-x-2 mt-1">
                  {alert?.notifications?.email && (
                    <div className="flex items-center space-x-1 text-primary">
                      <Icon name="Mail" size={14} />
                      <span>Email</span>
                    </div>
                  )}
                  {alert?.notifications?.push && (
                    <div className="flex items-center space-x-1 text-primary">
                      <Icon name="Bell" size={14} />
                      <span>Push</span>
                    </div>
                  )}
                  {alert?.notifications?.sms && (
                    <div className="flex items-center space-x-1 text-primary">
                      <Icon name="MessageSquare" size={14} />
                      <span>SMS</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-muted-foreground">Last Triggered:</span>
                <p className="text-foreground">
                  {alert?.lastTriggered 
                    ? new Date(alert.lastTriggered)?.toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
              
              <div>
                <span className="text-muted-foreground">Times Triggered:</span>
                <p className="text-foreground">{alert?.triggerCount || 0}</p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border flex space-x-2">
              <Button variant="outline" size="sm" iconName="Edit">
                Edit
              </Button>
              <Button variant="ghost" size="sm" iconName="Trash2" className="text-error">
                Delete
              </Button>
            </div>
          </div>
        ))}

        {alerts?.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Bell" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No Alerts Set</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Create spending alerts to stay on top of your budget.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              onClick={() => setShowCreateForm(true)}
            >
              Create Your First Alert
            </Button>
          </div>
        )}
      </div>
      {/* Create Alert Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
          <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-semibold text-foreground">Create Spending Alert</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowCreateForm(false)}>
                <Icon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleCreateAlert} className="p-6 space-y-4">
              <Input
                label="Alert Name"
                type="text"
                placeholder="e.g., Groceries Warning"
                value={newAlert?.name}
                onChange={(e) => setNewAlert(prev => ({ ...prev, name: e?.target?.value }))}
                required
              />

              <Input
                label="Category"
                type="text"
                placeholder="e.g., Groceries, Entertainment"
                value={newAlert?.category}
                onChange={(e) => setNewAlert(prev => ({ ...prev, category: e?.target?.value }))}
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Alert Type</label>
                <div className="flex space-x-2">
                  {alertTypes?.map((type) => (
                    <button
                      key={type?.id}
                      type="button"
                      onClick={() => setNewAlert(prev => ({ ...prev, type: type?.id }))}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors duration-200 ${
                        newAlert?.type === type?.id
                          ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon name={type?.icon} size={16} />
                      <span className="text-sm">{type?.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label={`Threshold ${newAlert?.type === 'percentage' ? '(%)' : '($)'}`}
                type="number"
                placeholder={newAlert?.type === 'percentage' ? '80' : '500'}
                value={newAlert?.threshold}
                onChange={(e) => setNewAlert(prev => ({ ...prev, threshold: e?.target?.value }))}
                required
              />

              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Notification Methods</label>
                <div className="space-y-2">
                  <Checkbox
                    label="Email notifications"
                    checked={newAlert?.notifications?.email}
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      notifications: { ...prev?.notifications, email: e?.target?.checked }
                    }))}
                  />
                  <Checkbox
                    label="Push notifications"
                    checked={newAlert?.notifications?.push}
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      notifications: { ...prev?.notifications, push: e?.target?.checked }
                    }))}
                  />
                  <Checkbox
                    label="SMS notifications"
                    checked={newAlert?.notifications?.sms}
                    onChange={(e) => setNewAlert(prev => ({
                      ...prev,
                      notifications: { ...prev?.notifications, sms: e?.target?.checked }
                    }))}
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" variant="default" className="flex-1">
                  Create Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpendingAlerts;