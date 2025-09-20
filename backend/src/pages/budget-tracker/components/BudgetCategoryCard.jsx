import React from 'react';
import Icon from '../../../components/AppIcon';

const BudgetCategoryCard = ({ category, onViewDetails, onEditBudget }) => {
  const getProgressColor = () => {
    const percentage = (category?.spent / category?.allocated) * 100;
    if (percentage >= 100) return 'bg-error';
    if (percentage >= 80) return 'bg-warning';
    return 'bg-success';
  };

  const getStatusIcon = () => {
    const percentage = (category?.spent / category?.allocated) * 100;
    if (percentage >= 100) return { name: 'AlertTriangle', color: 'text-error' };
    if (percentage >= 80) return { name: 'AlertCircle', color: 'text-warning' };
    return { name: 'CheckCircle', color: 'text-success' };
  };

  const percentage = Math.min((category?.spent / category?.allocated) * 100, 100);
  const statusIcon = getStatusIcon();

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${category?.color} rounded-lg flex items-center justify-center`}>
            <Icon name={category?.icon} size={20} color="white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{category?.name}</h3>
            <p className="text-sm text-muted-foreground">{category?.description}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Icon name={statusIcon?.name} size={16} className={statusIcon?.color} />
          <button
            onClick={() => onEditBudget(category)}
            className="p-1 hover:bg-muted rounded"
          >
            <Icon name="Settings" size={16} className="text-muted-foreground" />
          </button>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Spent</span>
          <span className="text-lg font-semibold text-foreground">
            ${category?.spent?.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Budget</span>
          <span className="text-sm text-muted-foreground">
            ${category?.allocated?.toLocaleString()}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Progress</span>
            <span className="text-sm font-medium text-foreground">
              {percentage?.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <span className="text-sm text-muted-foreground">Remaining</span>
          <span className={`text-sm font-medium ${
            category?.remaining >= 0 ? 'text-success' : 'text-error'
          }`}>
            ${Math.abs(category?.remaining)?.toLocaleString()}
            {category?.remaining < 0 && ' over'}
          </span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <button
          onClick={() => onViewDetails(category)}
          className="w-full flex items-center justify-center space-x-2 py-2 text-sm text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
        >
          <Icon name="Eye" size={16} />
          <span>View Details</span>
        </button>
      </div>
    </div>
  );
};

export default BudgetCategoryCard;