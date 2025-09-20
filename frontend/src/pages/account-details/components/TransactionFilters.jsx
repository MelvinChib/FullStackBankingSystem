import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const TransactionFilters = ({ onFilterChange, transactionCount }) => {
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    amountMin: '',
    amountMax: '',
    searchTerm: ''
  });
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'deposit', label: 'Deposits' },
    { value: 'withdrawal', label: 'Withdrawals' },
    { value: 'transfer', label: 'Transfers' },
    { value: 'payment', label: 'Payments' },
    { value: 'fee', label: 'Fees' },
    { value: 'interest', label: 'Interest' },
    { value: 'refund', label: 'Refunds' }
  ];

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      dateFrom: '',
      dateTo: '',
      category: '',
      amountMin: '',
      amountMax: '',
      searchTerm: ''
    };
    setFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-foreground">Filter Transactions</h3>
          <span className="text-sm text-muted-foreground">
            {transactionCount} transaction{transactionCount !== 1 ? 's' : ''} found
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
            className="lg:hidden"
          >
            <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={20} />
          </Button>
        </div>
      </div>
      {/* Search Bar - Always Visible */}
      <div className="mb-4">
        <div className="relative">
          <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search transactions by description or amount..."
            value={filters?.searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e?.target?.value)}
            className="pl-10"
          />
        </div>
      </div>
      {/* Advanced Filters */}
      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">From Date</label>
            <Input
              type="date"
              value={filters?.dateFrom}
              onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">To Date</label>
            <Input
              type="date"
              value={filters?.dateTo}
              onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Category</label>
            <Select
              options={categoryOptions}
              value={filters?.category}
              onChange={(value) => handleFilterChange('category', value)}
              placeholder="Select category"
            />
          </div>

          {/* Amount Range */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Amount Range</label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min"
                value={filters?.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={filters?.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
              />
            </div>
          </div>
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
              handleFilterChange('dateFrom', thirtyDaysAgo?.toISOString()?.split('T')?.[0]);
              handleFilterChange('dateTo', today?.toISOString()?.split('T')?.[0]);
            }}
          >
            Last 30 Days
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const today = new Date();
              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
              handleFilterChange('dateFrom', firstDay?.toISOString()?.split('T')?.[0]);
              handleFilterChange('dateTo', today?.toISOString()?.split('T')?.[0]);
            }}
          >
            This Month
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('category', 'deposit')}
          >
            Deposits Only
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleFilterChange('category', 'withdrawal')}
          >
            Withdrawals Only
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;