import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentTransfers = ({ transfers, onCancelTransfer, onModifyTransfer }) => {
  const [expandedTransfer, setExpandedTransfer] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'pending':
        return { name: 'Clock', color: 'text-warning' };
      case 'scheduled':
        return { name: 'Calendar', color: 'text-primary' };
      case 'failed':
        return { name: 'XCircle', color: 'text-error' };
      default:
        return { name: 'Circle', color: 'text-muted-foreground' };
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'pending':
        return 'Processing';
      case 'scheduled':
        return 'Scheduled';
      case 'failed':
        return 'Failed';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canModify = (transfer) => {
    return transfer?.status === 'scheduled' || transfer?.status === 'pending';
  };

  const toggleExpanded = (transferId) => {
    setExpandedTransfer(expandedTransfer === transferId ? null : transferId);
  };

  if (!transfers || transfers?.length === 0) {
    return (
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Recent Transfers</h3>
        <div className="text-center py-8">
          <Icon name="ArrowLeftRight" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent transfers</p>
          <p className="text-sm text-muted-foreground">Your transfer history will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Recent Transfers</h3>
        <Button variant="outline" size="sm" iconName="History" iconPosition="left">
          View All
        </Button>
      </div>
      <div className="space-y-4">
        {transfers?.slice(0, 5)?.map((transfer) => {
          const statusIcon = getStatusIcon(transfer?.status);
          const isExpanded = expandedTransfer === transfer?.id;

          return (
            <div
              key={transfer?.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transfer?.type === 'internal' ? 'bg-primary/10' : 
                    transfer?.type === 'external' ? 'bg-secondary/10' : 'bg-accent/10'
                  }`}>
                    <Icon 
                      name={transfer?.type === 'wire' ? 'Zap' : 'ArrowLeftRight'} 
                      size={20} 
                      className={
                        transfer?.type === 'internal' ? 'text-primary' : 
                        transfer?.type === 'external' ? 'text-secondary' : 'text-accent'
                      }
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-medium text-foreground truncate">
                        {transfer?.description || `Transfer to ${transfer?.toAccount}`}
                      </p>
                      <div className={`flex items-center space-x-1 ${statusIcon?.color}`}>
                        <Icon name={statusIcon?.name} size={14} />
                        <span className="text-xs font-medium">{getStatusText(transfer?.status)}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>{transfer?.fromAccount} → {transfer?.toAccount}</span>
                      <span>{formatDate(transfer?.date)}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-foreground">
                      ${Math.abs(transfer?.amount)?.toLocaleString()}
                    </p>
                    {transfer?.fee > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Fee: ${transfer?.fee?.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {canModify(transfer) && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="Edit"
                        onClick={() => onModifyTransfer && onModifyTransfer(transfer)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconName="X"
                        onClick={() => onCancelTransfer && onCancelTransfer(transfer)}
                      />
                    </>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
                    onClick={() => toggleExpanded(transfer?.id)}
                  />
                </div>
              </div>
              {/* Expanded Details */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-border animate-slide-down">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Transfer ID</p>
                      <p className="font-mono text-foreground">{transfer?.id}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Reference Number</p>
                      <p className="font-mono text-foreground">{transfer?.referenceNumber}</p>
                    </div>
                    {transfer?.frequency && transfer?.frequency !== 'once' && (
                      <div>
                        <p className="text-muted-foreground mb-1">Frequency</p>
                        <p className="text-foreground capitalize">{transfer?.frequency}</p>
                      </div>
                    )}
                    {transfer?.nextDate && (
                      <div>
                        <p className="text-muted-foreground mb-1">Next Transfer</p>
                        <p className="text-foreground">{formatDate(transfer?.nextDate)}</p>
                      </div>
                    )}
                  </div>

                  {transfer?.status === 'failed' && transfer?.failureReason && (
                    <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Icon name="AlertCircle" size={16} className="text-error mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-error">Transfer Failed</p>
                          <p className="text-sm text-error/80">{transfer?.failureReason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {transfers?.length > 5 && (
        <div className="mt-6 text-center">
          <Button variant="outline" iconName="ArrowDown" iconPosition="right">
            Load More Transfers
          </Button>
        </div>
      )}
    </div>
  );
};

export default RecentTransfers;