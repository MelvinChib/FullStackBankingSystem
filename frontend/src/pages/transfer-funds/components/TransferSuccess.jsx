import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TransferSuccess = ({ transferResult, onNewTransfer, onViewDashboard }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusMessage = () => {
    switch (transferResult?.transferType) {
      case 'internal':
        return 'Your transfer has been completed successfully!';
      case 'external':
        return 'Your transfer has been initiated and will be processed within 1-3 business days.';
      case 'wire':
        return 'Your wire transfer has been submitted and will be processed today.';
      default:
        return 'Your transfer has been processed successfully!';
    }
  };

  const getNextSteps = () => {
    const steps = [];
    
    if (transferResult?.transferType !== 'internal') {
      steps?.push('You will receive email and SMS notifications about the transfer status');
      steps?.push('The recipient will be notified once the transfer is completed');
    }
    
    if (transferResult?.frequency !== 'once') {
      steps?.push('Your recurring transfer has been set up and will continue as scheduled');
      steps?.push('You can modify or cancel recurring transfers from your dashboard');
    }
    
    steps?.push('A confirmation receipt has been sent to your registered email address');
    
    return steps;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="CheckCircle" size={32} color="white" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Transfer Successful!</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          {getStatusMessage()}
        </p>
      </div>
      {/* Transfer Summary */}
      <div className="bg-success/10 border border-success/20 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">Transfer Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Reference Number</span>
                <span className="text-sm font-mono font-medium text-foreground">
                  {transferResult?.referenceNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">From</span>
                <span className="text-sm font-medium text-foreground">
                  {transferResult?.fromAccountName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">To</span>
                <span className="text-sm font-medium text-foreground">
                  {transferResult?.toAccountName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="text-sm font-medium text-foreground capitalize">
                  {transferResult?.transferType} Transfer
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
                  ${parseFloat(transferResult?.amount)?.toLocaleString()}
                </span>
              </div>
              {transferResult?.fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fee</span>
                  <span className="text-sm font-medium text-foreground">
                    ${transferResult?.fee?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-lg font-semibold text-foreground">
                  ${transferResult?.totalAmount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Processed</span>
                <span className="text-sm font-medium text-foreground">
                  {formatDate(new Date())}
                </span>
              </div>
            </div>
          </div>
        </div>

        {transferResult?.description && (
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Description</span>
              <span className="text-sm font-medium text-foreground">{transferResult?.description}</span>
            </div>
          </div>
        )}
      </div>
      {/* Next Steps */}
      <div className="bg-muted/50 rounded-lg p-4 mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">What happens next?</h4>
        <ul className="space-y-2">
          {getNextSteps()?.map((step, index) => (
            <li key={index} className="flex items-start space-x-2 text-sm text-muted-foreground">
              <Icon name="Check" size={14} className="text-success mt-0.5 flex-shrink-0" />
              <span>{step}</span>
            </li>
          ))}
        </ul>
      </div>
      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Download" size={20} className="text-primary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Download Receipt</p>
            <p className="text-xs text-muted-foreground">PDF confirmation</p>
          </div>
        </button>

        <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="Share" size={20} className="text-secondary" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Share Receipt</p>
            <p className="text-xs text-muted-foreground">Email or print</p>
          </div>
        </button>

        <button className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors duration-200">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="Calendar" size={20} className="text-accent" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">Set Reminder</p>
            <p className="text-xs text-muted-foreground">Track completion</p>
          </div>
        </button>
      </div>
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
        <Button
          variant="default"
          onClick={onNewTransfer}
          className="flex-1"
          iconName="Plus"
          iconPosition="left"
        >
          Make Another Transfer
        </Button>
        
        <Button
          variant="outline"
          onClick={onViewDashboard}
          className="flex-1"
          iconName="LayoutDashboard"
          iconPosition="left"
        >
          View Dashboard
        </Button>
      </div>
    </div>
  );
};

export default TransferSuccess;