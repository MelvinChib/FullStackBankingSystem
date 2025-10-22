import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustBadges = [
    {
      id: 'security',
      icon: 'Shield',
      title: 'Bank-grade Security',
      description: 'Advanced encryption',
      color: 'text-primary'
    },
    {
      id: 'standards',
      icon: 'CheckCircle',
      title: 'Global Standards',
      description: 'Compliance focused',
      color: 'text-success'
    },
    {
      id: 'privacy',
      icon: 'Lock',
      title: 'Privacy Protection',
      description: 'Your data stays safe',
      color: 'text-secondary'
    }
  ];

  return (
    <div className="bg-muted/30 rounded-lg p-6 border border-border">
      <div className="text-center mb-4">
        <h3 className="text-sm font-semibold text-foreground mb-1">
          Your Security is Our Priority
        </h3>
        <p className="text-xs text-muted-foreground">
          Protected by industry-leading security measures
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {trustBadges?.map((badge) => (
          <div
            key={badge?.id}
            className="flex flex-col items-center text-center space-y-2 p-3 bg-card rounded-lg border border-border/50"
          >
            <div className={`w-8 h-8 ${badge?.color} bg-current/10 rounded-full flex items-center justify-center`}>
              <Icon name={badge?.icon} size={16} className={badge?.color} />
            </div>
            <div>
              <p className="text-xs font-medium text-foreground">{badge?.title}</p>
              <p className="text-xs text-muted-foreground">{badge?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Info" size={12} />
          <span>All transactions are monitored for fraud protection</span>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;