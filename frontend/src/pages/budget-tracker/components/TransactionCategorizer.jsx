import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const TransactionCategorizer = ({ transactions, categories, onCategorize, onBulkCategorize }) => {
  const [selectedTransactions, setSelectedTransactions] = useState(new Set());
  const [bulkCategory, setBulkCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('uncategorized');

  const statusOptions = [
    { value: 'all', label: 'All Transactions' },
    { value: 'uncategorized', label: 'Uncategorized Only' },
    { value: 'categorized', label: 'Categorized Only' },
  ];

  const categoryOptions = categories?.map(cat => ({
    value: cat?.id,
    label: cat?.name,
  }));

  const filteredTransactions = transactions?.filter(transaction => {
    if (filterStatus === 'uncategorized') return !transaction?.category;
    if (filterStatus === 'categorized') return transaction?.category;
    return true;
  });

  const handleTransactionSelect = (transactionId) => {
    const newSelected = new Set(selectedTransactions);
    if (newSelected?.has(transactionId)) {
      newSelected?.delete(transactionId);
    } else {
      newSelected?.add(transactionId);
    }
    setSelectedTransactions(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedTransactions?.size === filteredTransactions?.length) {
      setSelectedTransactions(new Set());
    } else {
      setSelectedTransactions(new Set(filteredTransactions.map(t => t.id)));
    }
  };

  const handleBulkCategorize = () => {
    if (bulkCategory && selectedTransactions?.size > 0) {
      onBulkCategorize(Array.from(selectedTransactions), bulkCategory);
      setSelectedTransactions(new Set());
      setBulkCategory('');
    }
  };

  const getCategoryInfo = (categoryId) => {
    return categories?.find(cat => cat?.id === categoryId);
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'income':
        return 'ArrowDownLeft';
      case 'expense':
        return 'ArrowUpRight';
      default:
        return 'ArrowLeftRight';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Transaction Categorization</h3>
          <p className="text-sm text-muted-foreground">
            Organize transactions into budget categories
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Select
            options={statusOptions}
            value={filterStatus}
            onChange={setFilterStatus}
            placeholder="Filter by status"
            className="w-full sm:w-48"
          />
        </div>
      </div>
      {selectedTransactions?.size > 0 && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {selectedTransactions?.size} transaction{selectedTransactions?.size > 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex space-x-2">
              <Select
                options={categoryOptions}
                value={bulkCategory}
                onChange={setBulkCategory}
                placeholder="Select category"
                className="w-48"
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleBulkCategorize}
                disabled={!bulkCategory}
              >
                Categorize Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between py-2 border-b border-border">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedTransactions?.size === filteredTransactions?.length && filteredTransactions?.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">
              Select All ({filteredTransactions?.length})
            </span>
          </div>
          <div className="text-sm text-muted-foreground">
            {filteredTransactions?.filter(t => !t?.category)?.length} uncategorized
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto space-y-2">
          {filteredTransactions?.map((transaction) => {
            const categoryInfo = transaction?.category ? getCategoryInfo(transaction?.category) : null;
            
            return (
              <div
                key={transaction?.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors duration-200 ${
                  selectedTransactions?.has(transaction?.id)
                    ? 'border-primary bg-primary/5' :'border-border hover:bg-muted'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTransactions?.has(transaction?.id)}
                  onChange={() => handleTransactionSelect(transaction?.id)}
                  className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary"
                />
                <div className={`w-8 h-8 ${
                  transaction?.type === 'income' ? 'bg-success' : 'bg-error'
                } rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon name={getTransactionIcon(transaction?.type)} size={16} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground truncate">
                      {transaction?.description}
                    </p>
                    <p className={`text-sm font-semibold ${
                      transaction?.type === 'income' ? 'text-success' : 'text-foreground'
                    }`}>
                      {transaction?.type === 'income' ? '+' : '-'}${Math.abs(transaction?.amount)?.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {new Date(transaction.date)?.toLocaleDateString()}
                    </p>
                    {categoryInfo ? (
                      <div className="flex items-center space-x-1">
                        <div className={`w-3 h-3 ${categoryInfo?.color} rounded-full`} />
                        <span className="text-xs text-muted-foreground">{categoryInfo?.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-warning">Uncategorized</span>
                    )}
                  </div>
                </div>
                {!transaction?.category && (
                  <div className="flex-shrink-0">
                    <Select
                      options={categoryOptions}
                      value=""
                      onChange={(value) => onCategorize(transaction?.id, value)}
                      placeholder="Category"
                      className="w-32"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredTransactions?.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="FileText" size={24} className="text-muted-foreground" />
            </div>
            <h4 className="text-lg font-medium text-foreground mb-2">
              {filterStatus === 'uncategorized' ? 'All Transactions Categorized' : 'No Transactions Found'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {filterStatus === 'uncategorized' ?'Great job! All your transactions have been categorized.' :'Try adjusting your filter settings to see transactions.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionCategorizer;