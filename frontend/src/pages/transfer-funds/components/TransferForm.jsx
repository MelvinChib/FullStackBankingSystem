import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransferForm = ({ accounts, beneficiaries, onTransfer, onAddBeneficiary }) => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    transferType: 'internal',
    amount: '',
    description: '',
    frequency: 'once',
    scheduledDate: '',
    beneficiaryId: ''
  });
  
  const [errors, setErrors] = useState({});
  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [showBeneficiaryForm, setShowBeneficiaryForm] = useState(false);

  const transferTypeOptions = [
    { value: 'internal', label: 'Between My Accounts', description: 'Free • Instant' },
    { value: 'external', label: 'To External Bank', description: '$3.00 fee • 1-3 business days' },
    { value: 'wire', label: 'Wire Transfer', description: '$25.00 fee • Same day' }
  ];

  const frequencyOptions = [
    { value: 'once', label: 'One Time' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  useEffect(() => {
    if (formData?.fromAccount) {
      const account = accounts?.find(acc => acc?.id === formData?.fromAccount);
      setSelectedFromAccount(account);
    }
  }, [formData?.fromAccount, accounts]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.fromAccount) {
      newErrors.fromAccount = 'Please select a source account';
    }

    if (formData?.transferType === 'internal' && !formData?.toAccount) {
      newErrors.toAccount = 'Please select a destination account';
    }

    if (formData?.transferType !== 'internal' && !formData?.beneficiaryId) {
      newErrors.beneficiaryId = 'Please select a beneficiary';
    }

    if (!formData?.amount || parseFloat(formData?.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    } else if (selectedFromAccount && parseFloat(formData?.amount) > selectedFromAccount?.balance) {
      newErrors.amount = 'Insufficient funds';
    }

    if (formData?.frequency !== 'once' && !formData?.scheduledDate) {
      newErrors.scheduledDate = 'Please select a start date for recurring transfers';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onTransfer(formData);
    }
  };

  const getAccountOptions = () => {
    return accounts?.map(account => ({
      value: account?.id,
      label: `${account?.name} (${account?.accountNumber})`,
      description: `Available: $${account?.balance?.toLocaleString()}`
    }));
  };

  const getDestinationAccountOptions = () => {
    return accounts?.filter(account => account?.id !== formData?.fromAccount)?.map(account => ({
        value: account?.id,
        label: `${account?.name} (${account?.accountNumber})`,
        description: `${account?.type}`
      }));
  };

  const getBeneficiaryOptions = () => {
    return beneficiaries?.map(beneficiary => ({
      value: beneficiary?.id,
      label: beneficiary?.nickname || beneficiary?.name,
      description: `${beneficiary?.bankName} • ${beneficiary?.accountNumber?.slice(-4)}`
    }));
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Transfer Funds</h2>
          <p className="text-sm text-muted-foreground">Move money between accounts or to external recipients</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-success">
          <Icon name="Shield" size={16} />
          <span>Secure Transfer</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transfer Type Selection */}
        <Select
          label="Transfer Type"
          options={transferTypeOptions}
          value={formData?.transferType}
          onChange={(value) => handleInputChange('transferType', value)}
          required
        />

        {/* From Account */}
        <Select
          label="From Account"
          options={getAccountOptions()}
          value={formData?.fromAccount}
          onChange={(value) => handleInputChange('fromAccount', value)}
          error={errors?.fromAccount}
          required
        />

        {/* To Account (Internal) or Beneficiary (External/Wire) */}
        {formData?.transferType === 'internal' ? (
          <Select
            label="To Account"
            options={getDestinationAccountOptions()}
            value={formData?.toAccount}
            onChange={(value) => handleInputChange('toAccount', value)}
            error={errors?.toAccount}
            placeholder="Select destination account"
            required
          />
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Send To</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                iconName="Plus"
                iconPosition="left"
                onClick={() => setShowBeneficiaryForm(true)}
              >
                Add Beneficiary
              </Button>
            </div>
            <Select
              options={getBeneficiaryOptions()}
              value={formData?.beneficiaryId}
              onChange={(value) => handleInputChange('beneficiaryId', value)}
              error={errors?.beneficiaryId}
              placeholder="Select beneficiary"
              required
            />
          </div>
        )}

        {/* Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            value={formData?.amount}
            onChange={(e) => handleInputChange('amount', e?.target?.value)}
            error={errors?.amount}
            required
            min="0.01"
            step="0.01"
          />
          
          {selectedFromAccount && (
            <div className="flex flex-col justify-end">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Available Balance</p>
                <p className="text-lg font-semibold text-foreground">
                  ${selectedFromAccount?.balance?.toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <Input
          label="Description (Optional)"
          type="text"
          placeholder="What's this transfer for?"
          value={formData?.description}
          onChange={(e) => handleInputChange('description', e?.target?.value)}
          maxLength={100}
        />

        {/* Frequency and Scheduling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Frequency"
            options={frequencyOptions}
            value={formData?.frequency}
            onChange={(value) => handleInputChange('frequency', value)}
          />
          
          {formData?.frequency !== 'once' && (
            <Input
              label="Start Date"
              type="date"
              value={formData?.scheduledDate}
              onChange={(e) => handleInputChange('scheduledDate', e?.target?.value)}
              error={errors?.scheduledDate}
              min={new Date()?.toISOString()?.split('T')?.[0]}
              required
            />
          )}
        </div>

        {/* Transfer Limits Info */}
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={16} className="text-primary mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">Transfer Limits</p>
              <ul className="text-muted-foreground space-y-1">
                <li>• Daily limit: $10,000</li>
                <li>• Monthly limit: $50,000</li>
                <li>• Wire transfers require additional verification for amounts over $5,000</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex space-x-4">
          <Button
            type="submit"
            variant="default"
            className="flex-1"
            iconName="ArrowRight"
            iconPosition="right"
          >
            {formData?.frequency === 'once' ? 'Transfer Now' : 'Schedule Transfer'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({
                fromAccount: '',
                toAccount: '',
                transferType: 'internal',
                amount: '',
                description: '',
                frequency: 'once',
                scheduledDate: '',
                beneficiaryId: ''
              });
              setErrors({});
            }}
          >
            Clear
          </Button>
        </div>
      </form>
      {/* Add Beneficiary Modal */}
      {showBeneficiaryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Add Beneficiary</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowBeneficiaryForm(false)}
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add a new recipient for external transfers
            </p>
            <Button
              variant="default"
              fullWidth
              onClick={() => {
                setShowBeneficiaryForm(false);
                if (onAddBeneficiary) onAddBeneficiary();
              }}
            >
              Continue to Add Beneficiary
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransferForm;