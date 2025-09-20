import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BudgetSetupModal = ({ isOpen, onClose, onSave, editingCategory = null }) => {
  const [formData, setFormData] = useState({
    name: editingCategory?.name || '',
    description: editingCategory?.description || '',
    allocated: editingCategory?.allocated || '',
    icon: editingCategory?.icon || 'DollarSign',
    color: editingCategory?.color || 'bg-primary',
    type: editingCategory?.type || 'monthly',
  });

  const [errors, setErrors] = useState({});

  const iconOptions = [
    { value: 'Home', label: 'Housing' },
    { value: 'Car', label: 'Transportation' },
    { value: 'ShoppingCart', label: 'Shopping' },
    { value: 'Utensils', label: 'Food & Dining' },
    { value: 'Gamepad2', label: 'Entertainment' },
    { value: 'Heart', label: 'Healthcare' },
    { value: 'GraduationCap', label: 'Education' },
    { value: 'Plane', label: 'Travel' },
    { value: 'DollarSign', label: 'General' },
  ];

  const colorOptions = [
    { value: 'bg-primary', label: 'Blue' },
    { value: 'bg-secondary', label: 'Teal' },
    { value: 'bg-accent', label: 'Orange' },
    { value: 'bg-success', label: 'Green' },
    { value: 'bg-warning', label: 'Yellow' },
    { value: 'bg-error', label: 'Red' },
  ];

  const typeOptions = [
    { value: 'monthly', label: 'Monthly Budget' },
    { value: 'weekly', label: 'Weekly Budget' },
    { value: 'yearly', label: 'Yearly Budget' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData?.name?.trim()) {
      newErrors.name = 'Category name is required';
    }
    
    if (!formData?.allocated || formData?.allocated <= 0) {
      newErrors.allocated = 'Budget amount must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onSave({
        ...formData,
        allocated: parseFloat(formData?.allocated),
        id: editingCategory?.id || Date.now(),
        spent: editingCategory?.spent || 0,
        remaining: parseFloat(formData?.allocated) - (editingCategory?.spent || 0),
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300 p-4">
      <div className="bg-card rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {editingCategory ? 'Edit Budget Category' : 'Create Budget Category'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Input
            label="Category Name"
            type="text"
            placeholder="e.g., Groceries, Entertainment"
            value={formData?.name}
            onChange={(e) => handleInputChange('name', e?.target?.value)}
            error={errors?.name}
            required
          />

          <Input
            label="Description"
            type="text"
            placeholder="Brief description of this category"
            value={formData?.description}
            onChange={(e) => handleInputChange('description', e?.target?.value)}
          />

          <Input
            label="Budget Amount"
            type="number"
            placeholder="0.00"
            value={formData?.allocated}
            onChange={(e) => handleInputChange('allocated', e?.target?.value)}
            error={errors?.allocated}
            required
          />

          <Select
            label="Budget Type"
            options={typeOptions}
            value={formData?.type}
            onChange={(value) => handleInputChange('type', value)}
          />

          <Select
            label="Category Icon"
            options={iconOptions}
            value={formData?.icon}
            onChange={(value) => handleInputChange('icon', value)}
          />

          <Select
            label="Category Color"
            options={colorOptions}
            value={formData?.color}
            onChange={(value) => handleInputChange('color', value)}
          />

          <div className="bg-muted rounded-lg p-4">
            <h4 className="text-sm font-medium text-foreground mb-2">Preview</h4>
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${formData?.color} rounded-lg flex items-center justify-center`}>
                <Icon name={formData?.icon} size={20} color="white" />
              </div>
              <div>
                <p className="font-medium text-foreground">{formData?.name || 'Category Name'}</p>
                <p className="text-sm text-muted-foreground">
                  ${formData?.allocated || '0'} {formData?.type}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              {editingCategory ? 'Update Category' : 'Create Category'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BudgetSetupModal;