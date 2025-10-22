import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TransferConfirmation = ({ transferData, onConfirm, onCancel, onBack }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [requiresAuth, setRequiresAuth] = useState(transferData?.amount > 5000);
  const [authCode, setAuthCode] = useState('');
  const [authError, setAuthError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return 'Immediately';
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransferFee = () => {
    switch (transferData?.transferType) {
      case 'external':
        return 3.00;
      case 'wire':
        return 25.00;
      default:
        return 0;
    }
  };

  const getProcessingTime = () => {
    switch (transferData?.transferType) {
      case 'internal':
        return 'Instant';
      case 'external':
        return '1-3 business days';
      case 'wire':
        return 'Same business day';
      default:
        return 'Unknown';
    }
  };

  const getTotalAmount = () => {
    return parseFloat(transferData?.amount) + getTransferFee();
  };

  const handleConfirm = async () => {
    if (requiresAuth && !authCode) {
      setAuthError('Please enter the verification code');
      return;
    }

    if (requiresAuth && authCode !== '123456') {
      setAuthError('Invalid verification code. Use 123456 for demo.');
      return;
    }

    setIsConfirming(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsConfirming(false);
      onConfirm({
        ...transferData,
        fee: getTransferFee(),
        totalAmount: getTotalAmount(),
        authCode: authCode || null
      });
    }, 2000);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
          <Icon name="CheckCircle" size={24} color="white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Confirm Transfer</h2>
          <p className="text-sm text-muted-foreground">Please review the transfer details</p>
        </div>
      </div>
      {/* Transfer Summary */}
      <div className="bg-muted/50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Transfer Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-sm font-medium text-foreground">{transferData?.fromAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm font-medium text-foreground">{transferData?.toAccountName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {transferData?.transferType} Transfer
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Frequency</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {transferData?.frequency}
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Amount & Timing</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Transfer Amount</span>
                <span className="text-sm font-medium text-foreground">
                  ${parseFloat(transferData?.amount)?.toLocaleString()}
                </span>
              </div>
              {getTransferFee() > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Transfer Fee</span>
                  <span className="text-sm font-medium text-foreground">
                    ${getTransferFee()?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-sm font-medium text-foreground">Total Amount</span>
                <span className="text-lg font-semibold text-foreground">
                  ${getTotalAmount()?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Processing Time</span>
                <span className="text-sm font-medium text-foreground">{getProcessingTime()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  {transferData?.frequency === 'once' ? 'Transfer Date' : 'Start Date'}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(transferData?.scheduledDate)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {transferData?.description && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm font-medium text-foreground">{transferData?.description}</span>
            </div>
          </div>
        )}
      </div>
      {/* Two-Factor Authentication */}
      {requiresAuth && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={20} className="text-warning mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-medium text-foreground mb-2">Additional Verification Required</h4>
              <p className="text-sm text-muted-foreground mb-4">
                For your security, transfers over $5,000 require additional verification. 
                Please enter the code sent to your registered mobile number.
              </p>
              <Input
                label="Verification Code"
                type="text"
                placeholder="Enter 6-digit code"
                value={authCode}
                onChange={(e) => {
                  setAuthCode(e?.target?.value);
                  setAuthError('');
                }}
                error={authError}
                maxLength={6}
                className="max-w-xs"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Demo code: 123456
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Important Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} className="text-primary mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Important Notice</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• This transfer cannot be cancelled once processed</li>
              <li>• External transfers may take 1-3 business days to complete</li>
              <li>• You will receive email and SMS notifications about the transfer status</li>
              {transferData?.frequency !== 'once' && (
                <li>• Recurring transfers can be modified or cancelled from your account dashboard</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="default"
          onClick={handleConfirm}
          loading={isConfirming}
          disabled={requiresAuth && !authCode}
          className="flex-1"
          iconName="CheckCircle"
          iconPosition="left"
        >
          {isConfirming ? 'Processing...' : 'Confirm Transfer'}
        </Button>
        
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isConfirming}
          className="flex-1"
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Back to Edit
        </Button>
        
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={isConfirming}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default TransferConfirmation;