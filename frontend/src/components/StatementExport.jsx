import React, { useState, useEffect } from 'react';
import ApiService from '../services/api';

const StatementExport = ({ accountId, accountName }) => {
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(accountId || '');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [isExporting, setIsExporting] = useState({});
  const [exportStatus, setExportStatus] = useState('');

  useEffect(() => {
    loadAccounts();
    // Set default date range (last 3 months)
    const today = new Date();
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(today.getMonth() - 3);
    
    setToDate(today.toISOString().split('T')[0]);
    setFromDate(threeMonthsAgo.toISOString().split('T')[0]);
  }, []);

  const loadAccounts = async () => {
    try {
      const accountsData = await ApiService.getUserAccounts();
      setAccounts(accountsData);
      if (!selectedAccount && accountsData.length > 0) {
        setSelectedAccount(accountsData[0].id);
      }
    } catch (error) {
      console.error('Failed to load accounts:', error);
      setExportStatus('Failed to load accounts. Please try again.');
    }
  };

  const formatDateForAPI = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString + 'T00:00:00').toISOString();
  };

  const handleExport = async (format) => {
    if (!selectedAccount) {
      setExportStatus('Please select an account');
      return;
    }

    setIsExporting(prev => ({ ...prev, [format]: true }));
    setExportStatus(`Generating ${format.toUpperCase()} statement...`);

    try {
      const fromDateTime = formatDateForAPI(fromDate);
      const toDateTime = formatDateForAPI(toDate);
      
      let content, filename;
      const timestamp = new Date().toISOString().split('T')[0];
      const selectedAccountData = accounts.find(acc => acc.id.toString() === selectedAccount);
      const accountNumber = selectedAccountData?.maskedAccountNumber || selectedAccount;

      switch (format) {
        case 'pdf':
          content = await ApiService.exportStatementPDF(selectedAccount, fromDateTime, toDateTime);
          filename = `MelvinBank_Statement_${accountNumber}_${timestamp}.pdf`;
          ApiService.downloadFile(content, filename, 'application/pdf');
          break;
        
        case 'csv':
          content = await ApiService.exportStatementCSV(selectedAccount, fromDateTime, toDateTime);
          filename = `MelvinBank_Statement_${accountNumber}_${timestamp}.csv`;
          ApiService.downloadFile(content, filename, 'text/csv');
          break;
        
        case 'text':
          content = await ApiService.exportStatementText(selectedAccount, fromDateTime, toDateTime);
          filename = `MelvinBank_Statement_${accountNumber}_${timestamp}.txt`;
          ApiService.downloadFile(content, filename, 'text/plain');
          break;
        
        default:
          throw new Error('Invalid export format');
      }

      setExportStatus(`${format.toUpperCase()} statement downloaded successfully!`);
      
      // Clear status after 3 seconds
      setTimeout(() => setExportStatus(''), 3000);

    } catch (error) {
      console.error(`Failed to export ${format} statement:`, error);
      setExportStatus(`Failed to export ${format.toUpperCase()} statement. Please try again.`);
      
      // Clear error after 5 seconds
      setTimeout(() => setExportStatus(''), 5000);
    } finally {
      setIsExporting(prev => ({ ...prev, [format]: false }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Export Bank Statement</h2>
        <p className="text-gray-600">Download your account statements in PDF, CSV, or Text format</p>
      </div>

      {/* Account Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Account
        </label>
        <select
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Choose an account</option>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.accountName} - {account.maskedAccountNumber} (ZMW {account.balance})
            </option>
          ))}
        </select>
      </div>

      {/* Date Range */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            From Date
          </label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            To Date
          </label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {/* PDF Export */}
        <button
          onClick={() => handleExport('pdf')}
          disabled={isExporting.pdf || !selectedAccount}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting.pdf ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          )}
          <span>Export PDF</span>
        </button>

        {/* CSV Export */}
        <button
          onClick={() => handleExport('csv')}
          disabled={isExporting.csv || !selectedAccount}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting.csv ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          )}
          <span>Export CSV</span>
        </button>

        {/* Text Export */}
        <button
          onClick={() => handleExport('text')}
          disabled={isExporting.text || !selectedAccount}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isExporting.text ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 2a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 000 2h8a1 1 0 100-2H6zm0 4a1 1 0 000 2h5a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          )}
          <span>Export Text</span>
        </button>
      </div>

      {/* Status Message */}
      {exportStatus && (
        <div className={`p-4 rounded-lg ${
          exportStatus.includes('Failed') || exportStatus.includes('error')
            ? 'bg-red-50 text-red-700 border border-red-200'
            : exportStatus.includes('successfully')
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-blue-50 text-blue-700 border border-blue-200'
        }`}>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            {exportStatus}
          </div>
        </div>
      )}

      {/* Format Information */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Export Formats:</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div><strong>PDF:</strong> Formatted document suitable for printing and official use</div>
          <div><strong>CSV:</strong> Spreadsheet format compatible with Excel and other applications</div>
          <div><strong>Text:</strong> Plain text format for basic viewing and processing</div>
        </div>
      </div>
    </div>
  );
};

export default StatementExport;