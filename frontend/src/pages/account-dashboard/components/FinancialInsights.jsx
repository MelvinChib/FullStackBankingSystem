import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const FinancialInsights = ({ spendingData, budgetData, alerts, onViewBudget }) => {
  const [activeTab, setActiveTab] = useState('spending');

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })?.format(amount);
  };

  const COLORS = ['#1B365D', '#4A90A4', '#F4A261', '#38A169', '#E53E3E', '#D69E2E'];

  const tabs = [
    { id: 'spending', label: 'Spending', icon: 'PieChart' },
    { id: 'budget', label: 'Budget', icon: 'Target' },
    { id: 'alerts', label: 'Alerts', icon: 'Bell' }
  ];

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'info':
        return 'Info';
      case 'success':
        return 'CheckCircle';
      default:
        return 'Bell';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning bg-warning/10';
      case 'info':
        return 'text-primary bg-primary/10';
      case 'success':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Financial Insights</h2>
          <p className="text-sm text-muted-foreground">Your spending and budget overview</p>
        </div>
        <Button
          variant="outline"
          onClick={onViewBudget}
          iconName="ExternalLink"
          iconPosition="right"
        >
          View Budget
        </Button>
      </div>
      <div className="flex space-x-1 mb-6 bg-muted rounded-lg p-1">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex-1 justify-center ${
              activeTab === tab?.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>
      {activeTab === 'spending' && (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {spendingData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS?.[index % COLORS?.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {spendingData?.map((category, index) => (
              <div key={category?.name} className="flex items-center space-x-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: COLORS?.[index % COLORS?.length] }}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{category?.name}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(category?.amount)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === 'budget' && (
        <div className="space-y-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="spent" fill="#4A90A4" />
                <Bar dataKey="budget" fill="#1B365D" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-3">
            {budgetData?.map((item) => {
              const percentage = (item?.spent / item?.budget) * 100;
              const isOverBudget = percentage > 100;
              
              return (
                <div key={item?.category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">{item?.category}</span>
                    <span className={`text-sm ${isOverBudget ? 'text-error' : 'text-muted-foreground'}`}>
                      {formatCurrency(item?.spent)} / {formatCurrency(item?.budget)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isOverBudget ? 'bg-error' : percentage > 80 ? 'bg-warning' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          {alerts?.length === 0 ? (
            <div className="text-center py-8">
              <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
              <p className="text-muted-foreground">No alerts at this time</p>
              <p className="text-sm text-muted-foreground mt-1">Your accounts are in good standing</p>
            </div>
          ) : (
            alerts?.map((alert) => (
              <div
                key={alert?.id}
                className={`flex items-start space-x-3 p-4 rounded-lg ${getAlertColor(alert?.type)}`}
              >
                <Icon name={getAlertIcon(alert?.type)} size={20} className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold mb-1">{alert?.title}</h4>
                  <p className="text-sm">{alert?.message}</p>
                  {alert?.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={alert?.action?.onClick}
                      className="mt-2"
                    >
                      {alert?.action?.label}
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default FinancialInsights;