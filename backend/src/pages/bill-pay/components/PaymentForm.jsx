import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PaymentForm = ({ payees, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    payeeId: '',
    amount: '',
    dueDate: '',
    recurring: 'none',
    customInterval: '',
    memo: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const recurringOptions = [
    { value: 'none', label: 'One-time payment' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'annually', label: 'Annually' },
    { value: 'custom', label: 'Custom interval' }
  ];

  const payeeOptions = payees?.map(payee => ({
    value: payee?.id,
    label: payee?.name,
    description: payee?.accountNumber ? `Account: ${payee?.accountNumber}` : ''
  }));

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.payeeId) {
      newErrors.payeeId = 'Please select a payee';
    }

    if (!formData?.amount) {
      newErrors.amount = 'Amount is required';
    } else if (parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData?.amount) > 10000) {
      newErrors.amount = 'Amount cannot exceed $10,000';
    }

    if (!formData?.dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      const selectedDate = new Date(formData.dueDate);
      const today = new Date();
      today?.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (formData?.recurring === 'custom' && !formData?.customInterval) {
      newErrors.customInterval = 'Custom interval is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
      setFormData({
        payeeId: '',
        amount: '',
        dueDate: '',
        recurring: 'none',
        customInterval: '',
        memo: ''
      });
    } catch (error) {
      setErrors({ submit: 'Failed to schedule payment. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPayee = payees?.find(p => p?.id === formData?.payeeId);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Icon name="Plus" size={20} color="white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Schedule Payment</h2>
            <p className="text-sm text-muted-foreground">Set up a new bill payment</p>
          </div>
        </div>
        {onCancel && (
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <Icon name="X" size={20} />
          </Button>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select
              label="Select Payee"
              placeholder="Choose a payee"
              options={payeeOptions}
              value={formData?.payeeId}
              onChange={(value) => handleInputChange('payeeId', value)}
              error={errors?.payeeId}
              required
              searchable
            />

            {selectedPayee && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                    <Icon name="Building2" size={16} color="white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{selectedPayee?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedPayee?.accountNumber && `Account: ${selectedPayee?.accountNumber}`}
                      {selectedPayee?.paymentMethod && ` • ${selectedPayee?.paymentMethod}`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Input
              label="Payment Amount"
              type="number"
              placeholder="0.00"
              value={formData?.amount}
              onChange={(e) => handleInputChange('amount', e?.target?.value)}
              error={errors?.amount}
              required
              min="0.01"
              max="10000"
              step="0.01"
            />

            <Input
              label="Due Date"
              type="date"
              value={formData?.dueDate}
              onChange={(e) => handleInputChange('dueDate', e?.target?.value)}
              error={errors?.dueDate}
              required
              min={new Date()?.toISOString()?.split('T')?.[0]}
            />
          </div>

          <div className="space-y-4">
            <Select
              label="Payment Schedule"
              placeholder="Select frequency"
              options={recurringOptions}
              value={formData?.recurring}
              onChange={(value) => handleInputChange('recurring', value)}
              description="Choose how often this payment should repeat"
            />

            {formData?.recurring === 'custom' && (
              <Input
                label="Custom Interval (days)"
                type="number"
                placeholder="Enter number of days"
                value={formData?.customInterval}
                onChange={(e) => handleInputChange('customInterval', e?.target?.value)}
                error={errors?.customInterval}
                required
                min="1"
                max="365"
              />
            )}

            <Input
              label="Memo (Optional)"
              type="text"
              placeholder="Add a note for this payment"
              value={formData?.memo}
              onChange={(e) => handleInputChange('memo', e?.target?.value)}
              maxLength="100"
            />

            {formData?.amount && (
              <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center space-x-2 text-success">
                  <Icon name="CheckCircle" size={16} />
                  <span className="text-sm font-medium">
                    Payment Amount: ${parseFloat(formData?.amount || 0)?.toFixed(2)}
                  </span>
                </div>
                {formData?.recurring !== 'none' && (
                  <p className="text-xs text-success mt-1">
                    Recurring {formData?.recurring === 'custom' ? `every ${formData?.customInterval} days` : formData?.recurring}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {errors?.submit && (
          <div className="p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2 text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">{errors?.submit}</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-border">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={isSubmitting}
            iconName="Calendar"
            iconPosition="left"
            disabled={!formData?.payeeId || !formData?.amount || !formData?.dueDate}
          >
            Schedule Payment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;