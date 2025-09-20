import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GoalTracker = ({ goals, onAddGoal, onUpdateGoal }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const getGoalIcon = (type) => {
    switch (type) {
      case 'savings':
        return 'PiggyBank';
      case 'debt':
        return 'CreditCard';
      case 'spending':
        return 'TrendingDown';
      default:
        return 'Target';
    }
  };

  const getProgressColor = (current, target, type) => {
    const percentage = type === 'debt' 
      ? ((target - current) / target) * 100 
      : (current / target) * 100;
    
    if (percentage >= 100) return 'bg-success';
    if (percentage >= 75) return 'bg-primary';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-muted';
  };

  const calculateProgress = (current, target, type) => {
    if (type === 'debt') {
      return Math.min(((target - current) / target) * 100, 100);
    }
    return Math.min((current / target) * 100, 100);
  };

  const formatTimeRemaining = (targetDate) => {
    const now = new Date();
    const target = new Date(targetDate);
    const diffTime = target - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return '1 day left';
    if (diffDays < 30) return `${diffDays} days left`;
    
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? 's' : ''} left`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Financial Goals</h3>
          <p className="text-sm text-muted-foreground">Track your progress toward financial objectives</p>
        </div>
        <Button
          variant="default"
          size="sm"
          iconName="Plus"
          onClick={() => setShowAddForm(true)}
        >
          Add Goal
        </Button>
      </div>
      <div className="space-y-4">
        {goals?.map((goal) => {
          const progress = calculateProgress(goal?.current, goal?.target, goal?.type);
          
          return (
            <div key={goal?.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${goal?.color} rounded-lg flex items-center justify-center`}>
                    <Icon name={getGoalIcon(goal?.type)} size={20} color="white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{goal?.name}</h4>
                    <p className="text-sm text-muted-foreground">{goal?.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    {formatTimeRemaining(goal?.targetDate)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Target: {new Date(goal.targetDate)?.toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {goal?.type === 'debt' ? 'Remaining' : 'Current'}
                  </span>
                  <span className="text-lg font-semibold text-foreground">
                    ${goal?.current?.toLocaleString()}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Target</span>
                  <span className="text-sm text-muted-foreground">
                    ${goal?.target?.toLocaleString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Progress</span>
                    <span className="text-sm font-medium text-foreground">
                      {progress?.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal?.current, goal?.target, goal?.type)}`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {goal?.type === 'savings' && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Monthly needed</span>
                    <span className="font-medium text-foreground">
                      ${goal?.monthlyTarget?.toLocaleString() || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Plus"
                  onClick={() => onUpdateGoal(goal?.id)}
                >
                  Update Progress
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="Edit"
                  onClick={() => onUpdateGoal(goal?.id)}
                >
                  Edit
                </Button>
              </div>
            </div>
          );
        })}

        {goals?.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Target" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">No Goals Set</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Start tracking your financial objectives by creating your first goal.
            </p>
            <Button
              variant="default"
              iconName="Plus"
              onClick={() => setShowAddForm(true)}
            >
              Create Your First Goal
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalTracker;