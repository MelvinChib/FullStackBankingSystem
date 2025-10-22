import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const ExportControls = ({ transactionCount, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [exportRange, setExportRange] = useState('current');
  const [isExporting, setIsExporting] = useState(false);

  const formatOptions = [
    { value: 'pdf', label: 'PDF Statement' },
    { value: 'csv', label: 'CSV Data' },
    { value: 'excel', label: 'Excel Spreadsheet' }
  ];

  const rangeOptions = [
    { value: 'current', label: 'Current Results' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
    { value: 'all', label: 'All Transactions' }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (onExport) {
        onExport({ format: exportFormat, range: exportRange });
      }
      
      // Create mock download
      const filename = `transactions_${new Date()?.toISOString()?.split('T')?.[0]}.${exportFormat}`;
      const link = document.createElement('a');
      link.href = '#';
      link.download = filename;
      link?.click();
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Export Transactions</h3>
          <p className="text-sm text-muted-foreground">
            Download your transaction data for personal financial management
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          {/* Format Selection */}
          <div className="min-w-[160px]">
            <Select
              options={formatOptions}
              value={exportFormat}
              onChange={setExportFormat}
              placeholder="Select format"
            />
          </div>

          {/* Range Selection */}
          <div className="min-w-[160px]">
            <Select
              options={rangeOptions}
              value={exportRange}
              onChange={setExportRange}
              placeholder="Select range"
            />
          </div>

          {/* Export Button */}
          <Button
            variant="default"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
            iconPosition="left"
            className="whitespace-nowrap"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Export Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Icon name="FileText" size={16} />
            <span>{transactionCount} transactions</span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Calendar" size={16} />
            <span>
              {exportRange === 'current' ? 'Filtered results' : 
               exportRange === 'month' ? 'Current month' :
               exportRange === 'quarter' ? 'Current quarter' :
               exportRange === 'year' ? 'Current year' : 'All time'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Icon name="Shield" size={16} />
            <span>Secure download</span>
          </div>
        </div>
      </div>

      {/* Format Information */}
      <div className="mt-3 p-3 bg-muted/30 rounded-lg">
        <div className="text-xs text-muted-foreground">
          {exportFormat === 'pdf' && (
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
              <span>PDF format includes formatted statements with account summary and transaction details, perfect for record keeping.</span>
            </div>
          )}
          {exportFormat === 'csv' && (
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
              <span>CSV format provides raw transaction data that can be imported into spreadsheet applications or financial software.</span>
            </div>
          )}
          {exportFormat === 'excel' && (
            <div className="flex items-start space-x-2">
              <Icon name="Info" size={14} className="mt-0.5 flex-shrink-0" />
              <span>Excel format includes formatted data with charts and summaries, ready for analysis in Microsoft Excel.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportControls;