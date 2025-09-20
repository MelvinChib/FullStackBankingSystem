import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';

const AutoPaySettings = ({ payees, autoPaySettings, onUpdateSettings, onClose }) => {
  const [selectedPayee, setSelectedPayee] = useState('');
  const [settings, setSettings] = useState({
    enabled: false,
    amount: '',
    amountType: 'fixed', // 'fixed', 'minimum', 'full\'maxAmount: '',
    daysBefore: '3',
    notifications: {
      email: true,
      sms: false,
      push: true
    }
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const amountTypeOptions = [
    { value: 'fixed', label: 'Fixed Amount', description: 'Pay the same amount each time' },
    { value: 'minimum', label: 'Minimum Payment', description: 'Pay the minimum amount due' },
    { value: 'full', label: 'Full Balance', description: 'Pay the full statement balance' }
  ];

  const dayOptions = [
    { value: '1', label: '1 day before' },
    { value: '2', label: '2 days before' },
    { value: '3', label: '3 days before' },
    { value: '5', label: '5 days before' },
    { value: '7', label: '1 week before' }
  ];

  const payeeOptions = payees?.map(payee => ({
    value: payee?.id,
    label: payee?.name,
    description: payee?.accountNumber ? `Account: ${payee?.accountNumber}` : ''
  }));

  const handlePayeeSelect = (payeeId) => {
    setSelectedPayee(payeeId);
    const existingSettings = autoPaySettings?.find(s => s?.payeeId === payeeId);
    
    if (existingSettings) {
      setSettings(existingSettings);
    } else {
      setSettings({
        enabled: false,
        amount: '',
        amountType: 'fixed',
        maxAmount: '',
        daysBefore: '3',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      });
    }
    setErrors({});
  };

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleNotificationChange = (type, checked) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev?.notifications,
        [type]: checked
      }
    }));
  };

  const validateSettings = () => {
    const newErrors = {};

    if (!selectedPayee) {
      newErrors.payee = 'Please select a payee';
      return newErrors;
    }

    if (settings?.enabled) {
      if (settings?.amountType === 'fixed' && !settings?.amount) {
        newErrors.amount = 'Fixed amount is required';
      } else if (settings?.amountType === 'fixed' && parseFloat(settings?.amount) <= 0) {
        newErrors.amount = 'Amount must be greater than 0';
      }

      if (settings?.maxAmount && parseFloat(settings?.maxAmount) <= 0) {
        newErrors.maxAmount = 'Maximum amount must be greater than 0';
      }

      if (settings?.amountType === 'fixed' && settings?.maxAmount && 
          parseFloat(settings?.amount) > parseFloat(settings?.maxAmount)) {
        newErrors.amount = 'Fixed amount cannot exceed maximum amount';
      }
    }

    setErrors(newErrors);
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    const validationErrors = validateSettings();
    if (Object.keys(validationErrors)?.length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onUpdateSettings(selectedPayee, settings);
      // Reset form after successful update
      setSelectedPayee('');
      setSettings({
        enabled: false,
        amount: '',
        amountType: 'fixed',
        maxAmount: '',
        daysBefore: '3',
        notifications: {
          email: true,
          sms: false,
          push: true
        }
      });
    } catch (error) {
      setErrors({ submit: 'Failed to update AutoPay settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPayeeData = payees?.find(p => p?.id === selectedPayee);
  const existingSettings = autoPaySettings?.find(s => s?.payeeId === selectedPayee);

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-lg flex items-center justify-center">
              <Icon name="Repeat" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">AutoPay Settings</h2>
              <p className="text-sm text-muted-foreground">
                Set up automatic payments for your bills
              </p>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          )}
        </div>
      </div>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Payee Selection */}
          <Select
            label="Select Payee"
            placeholder="Choose a payee to set up AutoPay"
            options={payeeOptions}
            value={selectedPayee}
            onChange={handlePayeeSelect}
            error={errors?.payee}
            required
            searchable
          />

          {selectedPayeeData && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                  <Icon name="Building2" size={16} color="white" />
                </div>
                <div>
                  <p className="font-medium text-foreground">{selectedPayeeData?.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedPayeeData?.accountNumber && `Account: ${selectedPayeeData?.accountNumber}`}
                    {selectedPayeeData?.paymentMethod && ` • ${selectedPayeeData?.paymentMethod}`}
                  </p>
                </div>
                {existingSettings && existingSettings?.enabled && (
                  <div className="ml-auto">
                    <div className="px-2 py-1 bg-success/20 text-success rounded-full text-xs font-medium">
                      AutoPay Active
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedPayee && (
            <>
              {/* Enable AutoPay */}
              <div className="space-y-4">
                <Checkbox
                  label="Enable AutoPay for this payee"
                  description="Automatically pay this bill before the due date"
                  checked={settings?.enabled}
                  onChange={(e) => handleSettingChange('enabled', e?.target?.checked)}
                />

                {settings?.enabled && (
                  <div className="pl-6 space-y-4 border-l-2 border-primary/20">
                    {/* Payment Amount Type */}
                    <Select
                      label="Payment Amount"
                      options={amountTypeOptions}
                      value={settings?.amountType}
                      onChange={(value) => handleSettingChange('amountType', value)}
                      description="Choose how much to pay automatically"
                    />

                    {/* Fixed Amount Input */}
                    {settings?.amountType === 'fixed' && (
                      <Input
                        label="Fixed Payment Amount"
                        type="number"
                        placeholder="0.00"
                        value={settings?.amount}
                        onChange={(e) => handleSettingChange('amount', e?.target?.value)}
                        error={errors?.amount}
                        required
                        min="0.01"
                        step="0.01"
                      />
                    )}

                    {/* Maximum Amount Limit */}
                    <Input
                      label="Maximum Payment Limit (Optional)"
                      type="number"
                      placeholder="0.00"
                      value={settings?.maxAmount}
                      onChange={(e) => handleSettingChange('maxAmount', e?.target?.value)}
                      error={errors?.maxAmount}
                      description="Set a safety limit to prevent overpayment"
                      min="0.01"
                      step="0.01"
                    />

                    {/* Payment Timing */}
                    <Select
                      label="Payment Timing"
                      options={dayOptions}
                      value={settings?.daysBefore}
                      onChange={(value) => handleSettingChange('daysBefore', value)}
                      description="When to process the payment before the due date"
                    />

                    {/* Notification Preferences */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">
                        Notification Preferences
                      </label>
                      <p className="text-xs text-muted-foreground">
                        Choose how you want to be notified about AutoPay activities
                      </p>
                      
                      <div className="space-y-2">
                        <Checkbox
                          label="Email notifications"
                          description="Receive email confirmations for AutoPay transactions"
                          checked={settings?.notifications?.email}
                          onChange={(e) => handleNotificationChange('email', e?.target?.checked)}
                        />
                        
                        <Checkbox
                          label="SMS notifications"
                          description="Receive text message alerts for AutoPay transactions"
                          checked={settings?.notifications?.sms}
                          onChange={(e) => handleNotificationChange('sms', e?.target?.checked)}
                        />
                        
                        <Checkbox
                          label="Push notifications"
                          description="Receive app notifications for AutoPay activities"
                          checked={settings?.notifications?.push}
                          onChange={(e) => handleNotificationChange('push', e?.target?.checked)}
                        />
                      </div>
                    </div>

                    {/* AutoPay Summary */}
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <h4 className="text-sm font-medium text-primary mb-2">AutoPay Summary</h4>
                      <div className="space-y-1 text-sm text-foreground">
                        <p>
                          <span className="text-muted-foreground">Payment:</span>{' '}
                          {settings?.amountType === 'fixed' && `$${settings?.amount}`}
                          {settings?.amountType === 'minimum' && 'Minimum amount due'}
                          {settings?.amountType === 'full' && 'Full balance'}
                        </p>
                        <p>
                          <span className="text-muted-foreground">Timing:</span>{' '}
                          {settings?.daysBefore} day{settings?.daysBefore !== '1' ? 's' : ''} before due date
                        </p>
                        {settings?.maxAmount && (
                          <p>
                            <span className="text-muted-foreground">Maximum limit:</span>{' '}
                            ${settings?.maxAmount}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {errors?.submit && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
                  <div className="flex items-center space-x-2 text-error">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">{errors?.submit}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPayee('');
                    setSettings({
                      enabled: false,
                      amount: '',
                      amountType: 'fixed',
                      maxAmount: '',
                      daysBefore: '3',
                      notifications: {
                        email: true,
                        sms: false,
                        push: true
                      }
                    });
                    setErrors({});
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  iconName="Save"
                  iconPosition="left"
                >
                  {existingSettings ? 'Update AutoPay' : 'Set Up AutoPay'}
                </Button>
              </div>
            </>
          )}
        </form>

        {/* Existing AutoPay Settings */}
        {autoPaySettings?.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-md font-semibold text-foreground mb-4">Active AutoPay Settings</h3>
            <div className="space-y-3">
              {autoPaySettings?.filter(s => s?.enabled)?.map((setting) => {
                const payee = payees?.find(p => p?.id === setting?.payeeId);
                if (!payee) return null;

                return (
                  <div key={setting?.payeeId} className="flex items-center justify-between p-3 bg-success/10 border border-success/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-success rounded-lg flex items-center justify-center">
                        <Icon name="Repeat" size={14} color="white" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{payee?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {setting?.amountType === 'fixed' && `$${setting?.amount}`}
                          {setting?.amountType === 'minimum' && 'Minimum payment'}
                          {setting?.amountType === 'full' && 'Full balance'}
                          {' • '}
                          {setting?.daysBefore} day{setting?.daysBefore !== '1' ? 's' : ''} before due
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handlePayeeSelect(setting?.payeeId)}
                      iconName="Settings"
                      iconPosition="left"
                    >
                      Manage
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutoPaySettings;