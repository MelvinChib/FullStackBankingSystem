import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SpendingChart = ({ data, type = 'bar', onDrillDown }) => {
  const [chartType, setChartType] = useState(type);
  const [timeRange, setTimeRange] = useState('6months');

  const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: 'BarChart3' },
    { id: 'pie', label: 'Pie Chart', icon: 'PieChart' },
    { id: 'line', label: 'Trend Line', icon: 'TrendingUp' },
  ];

  const timeRanges = [
    { id: '3months', label: '3 Months' },
    { id: '6months', label: '6 Months' },
    { id: '1year', label: '1 Year' },
  ];

  const colors = ['#1B365D', '#4A90A4', '#F4A261', '#38A169', '#E53E3E', '#D69E2E'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload?.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground">{label}</p>
          {payload?.map((entry, index) => (
            <p key={index} className="text-sm text-muted-foreground">
              <span style={{ color: entry?.color }}>●</span>
              {` ${entry?.name}: $${entry?.value?.toLocaleString()}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderBarChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${value?.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar 
          dataKey="amount" 
          fill="var(--color-primary)"
          radius={[4, 4, 0, 0]}
          onClick={onDrillDown}
          style={{ cursor: 'pointer' }}
        />
      </BarChart>
    </ResponsiveContainer>
  );

  const renderPieChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100)?.toFixed(0)}%`}
          outerRadius={120}
          fill="#8884d8"
          dataKey="amount"
        >
          {data?.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors?.[index % colors?.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderLineChart = () => (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          fontSize={12}
          tickFormatter={(value) => `$${value?.toLocaleString()}`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="amount" 
          stroke="var(--color-primary)"
          strokeWidth={3}
          dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );

  const renderChart = () => {
    switch (chartType) {
      case 'pie':
        return renderPieChart();
      case 'line':
        return renderLineChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Spending Analysis</h3>
          <p className="text-sm text-muted-foreground">Interactive spending visualization</p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {chartTypes?.map((type) => (
              <button
                key={type?.id}
                onClick={() => setChartType(type?.id)}
                className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors duration-200 ${
                  chartType === type?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={type?.icon} size={14} />
                <span className="hidden sm:inline">{type?.label}</span>
              </button>
            ))}
          </div>
          
          <div className="flex space-x-1 bg-muted rounded-lg p-1">
            {timeRanges?.map((range) => (
              <button
                key={range?.id}
                onClick={() => setTimeRange(range?.id)}
                className={`px-3 py-1 rounded text-sm transition-colors duration-200 ${
                  timeRange === range?.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {range?.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-96">
        {renderChart()}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export Chart
          </Button>
          <Button variant="outline" size="sm" iconName="Share">
            Share
          </Button>
          <Button variant="outline" size="sm" iconName="Filter">
            Filter Data
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SpendingChart;