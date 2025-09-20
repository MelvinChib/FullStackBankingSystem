import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PayeeManager = ({ payees, onAddPayee, onEditPayee, onDeletePayee, onClose }) => {
  const [isAddingPayee, setIsAddingPayee] = useState(false);
  const [editingPayee, setEditingPayee] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    accountNumber: '',
    address: '',
    paymentMethod: 'electronic',
    category: 'utilities',
    nickname: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const paymentMethodOptions = [
    { value: 'electronic', label: 'Electronic Payment' },
    { value: 'check', label: 'Paper Check' }
  ];

  const categoryOptions = [
    { value: 'utilities', label: 'Utilities' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'mortgage', label: 'Mortgage/Rent' },
    { value: 'insurance', label: 'Insurance' },
    { value: 'loan', label: 'Loan Payment' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'other', label: 'Other' }
  ];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'utilities':
        return 'Zap';
      case 'credit_card':
        return 'CreditCard';
      case 'mortgage':
        return 'Home';
      case 'insurance':
        return 'Shield';
      case 'loan':
        return 'DollarSign';
      case 'subscription':
        return 'Repeat';
      case 'healthcare':
        return 'Heart';
      default:
        return 'Building2';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name?.trim()) {
      newErrors.name = 'Payee name is required';
    }

    if (!formData?.accountNumber?.trim()) {
      newErrors.accountNumber = 'Account number is required';
    }

    if (formData?.paymentMethod === 'check' && !formData?.address?.trim()) {
      newErrors.address = 'Address is required for check payments';
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
      if (editingPayee) {
        await onEditPayee({ ...editingPayee, ...formData });
      } else {
        await onAddPayee(formData);
      }
      
      resetForm();
    } catch (error) {
      setErrors({ submit: 'Failed to save payee. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      accountNumber: '',
      address: '',
      paymentMethod: 'electronic',
      category: 'utilities',
      nickname: ''
    });
    setErrors({});
    setIsAddingPayee(false);
    setEditingPayee(null);
  };

  const handleEdit = (payee) => {
    setFormData({
      name: payee?.name,
      accountNumber: payee?.accountNumber,
      address: payee?.address || '',
      paymentMethod: payee?.paymentMethod,
      category: payee?.category,
      nickname: payee?.nickname || ''
    });
    setEditingPayee(payee);
    setIsAddingPayee(true);
  };

  const handleDelete = async (payeeId) => {
    if (window.confirm('Are you sure you want to delete this payee?')) {
      await onDeletePayee(payeeId);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Manage Payees</h2>
              <p className="text-sm text-muted-foreground">
                {payees?.length} saved payee{payees?.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="default"
              onClick={() => setIsAddingPayee(true)}
              iconName="Plus"
              iconPosition="left"
              disabled={isAddingPayee}
            >
              Add Payee
            </Button>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <Icon name="X" size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
      {/* Add/Edit Payee Form */}
      {isAddingPayee && (
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="text-md font-semibold text-foreground mb-4">
            {editingPayee ? 'Edit Payee' : 'Add New Payee'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Payee Name"
                type="text"
                placeholder="Enter payee name"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                error={errors?.name}
                required
              />

              <Input
                label="Nickname (Optional)"
                type="text"
                placeholder="Friendly name"
                value={formData?.nickname}
                onChange={(e) => handleInputChange('nickname', e?.target?.value)}
              />

              <Input
                label="Account Number"
                type="text"
                placeholder="Enter account number"
                value={formData?.accountNumber}
                onChange={(e) => handleInputChange('accountNumber', e?.target?.value)}
                error={errors?.accountNumber}
                required
              />

              <Select
                label="Category"
                options={categoryOptions}
                value={formData?.category}
                onChange={(value) => handleInputChange('category', value)}
              />

              <Select
                label="Payment Method"
                options={paymentMethodOptions}
                value={formData?.paymentMethod}
                onChange={(value) => handleInputChange('paymentMethod', value)}
                description="Electronic payments are faster and more secure"
              />

              {formData?.paymentMethod === 'check' && (
                <Input
                  label="Mailing Address"
                  type="text"
                  placeholder="Enter mailing address"
                  value={formData?.address}
                  onChange={(e) => handleInputChange('address', e?.target?.value)}
                  error={errors?.address}
                  required
                />
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

            <div className="flex items-center justify-end space-x-3">
              <Button variant="outline" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                loading={isSubmitting}
                iconName="Save"
                iconPosition="left"
              >
                {editingPayee ? 'Update Payee' : 'Add Payee'}
              </Button>
            </div>
          </form>
        </div>
      )}
      {/* Payees List */}
      <div className="divide-y divide-border">
        {payees?.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Users" size={24} className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No Payees Added</h3>
            <p className="text-muted-foreground mb-4">
              Add your first payee to start scheduling payments.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsAddingPayee(true)}
              iconName="Plus"
              iconPosition="left"
            >
              Add Your First Payee
            </Button>
          </div>
        ) : (
          payees?.map((payee) => (
            <div key={payee?.id} className="p-4 hover:bg-muted/50 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center">
                    <Icon name={getCategoryIcon(payee?.category)} size={20} color="white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground">
                      {payee?.nickname || payee?.name}
                    </h3>
                    {payee?.nickname && (
                      <p className="text-sm text-muted-foreground">{payee?.name}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-1">
                      <p className="text-xs text-muted-foreground">
                        Account: {payee?.accountNumber}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground capitalize">
                        {payee?.paymentMethod?.replace('_', ' ')}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground capitalize">
                        {payee?.category?.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(payee)}
                  >
                    <Icon name="Edit" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(payee?.id)}
                    className="text-error hover:text-error"
                  >
                    <Icon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PayeeManager;