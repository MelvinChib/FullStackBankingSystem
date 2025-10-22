import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import { gradients } from '../../styles/palette';

const SettingCard = ({ title, description, children }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6">
    <div className="mb-4">
      <h3 className="text-lg font-medium text-gray-900">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    {children}
  </div>
);

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    bankName: 'MelCredit Union Bank',
    supportEmail: 'support@melcredit.com',
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: '30',
    maxLoginAttempts: '5',
    currency: 'ZMW',
    dateFormat: 'DD/MM/YYYY',
    timeZone: 'Africa/Lusaka',
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving settings:', settings);
    // Implementation would save to backend
    setHasChanges(false);
  };

  const handleReset = () => {
    // Reset to original values (would typically fetch from backend)
    setHasChanges(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">System Settings</h1>
            <p className="text-sm text-gray-600">Configure application settings and preferences</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin">
              <Button variant="outline">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Admin
              </Button>
            </a>
            {hasChanges && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset}>
                  Reset
                </Button>
                <Button onClick={handleSave}>
                  <Icon name="Save" size={16} className="mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* General Settings */}
          <SettingCard
            title="General Settings"
            description="Basic application configuration"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Bank Name"
                value={settings.bankName}
                onChange={(e) => handleInputChange('bankName', e.target.value)}
              />
              <Input
                label="Support Email"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => handleInputChange('supportEmail', e.target.value)}
              />
            </div>
          </SettingCard>

          {/* Security Settings */}
          <SettingCard
            title="Security Settings"
            description="Authentication and security configuration"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                />
                <Input
                  label="Max Login Attempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <Checkbox
                  label="Allow new user registration"
                  checked={settings.allowRegistration}
                  onChange={(checked) => handleInputChange('allowRegistration', checked)}
                />
                <Checkbox
                  label="Require email verification for new accounts"
                  checked={settings.requireEmailVerification}
                  onChange={(checked) => handleInputChange('requireEmailVerification', checked)}
                />
              </div>
            </div>
          </SettingCard>

          {/* Regional Settings */}
          <SettingCard
            title="Regional Settings"
            description="Localization and formatting preferences"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Currency"
                value={settings.currency}
                onChange={(value) => handleInputChange('currency', value)}
                options={[
                  { value: 'ZMW', label: 'Zambian Kwacha (ZMW)' },
                  { value: 'USD', label: 'US Dollar (USD)' },
                  { value: 'EUR', label: 'Euro (EUR)' },
                ]}
              />
              <Select
                label="Date Format"
                value={settings.dateFormat}
                onChange={(value) => handleInputChange('dateFormat', value)}
                options={[
                  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
                ]}
              />
              <Select
                label="Time Zone"
                value={settings.timeZone}
                onChange={(value) => handleInputChange('timeZone', value)}
                options={[
                  { value: 'Africa/Lusaka', label: 'Africa/Lusaka (CAT)' },
                  { value: 'UTC', label: 'UTC' },
                  { value: 'America/New_York', label: 'America/New_York (EST)' },
                ]}
              />
            </div>
          </SettingCard>

          {/* System Maintenance */}
          <SettingCard
            title="System Maintenance"
            description="Control system availability and maintenance"
          >
            <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Icon name="AlertTriangle" size={20} className="text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-800">Maintenance Mode</p>
                  <p className="text-sm text-yellow-600">
                    When enabled, only admins can access the system
                  </p>
                </div>
              </div>
              <Checkbox
                checked={settings.maintenanceMode}
                onChange={(checked) => handleInputChange('maintenanceMode', checked)}
              />
            </div>
          </SettingCard>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;