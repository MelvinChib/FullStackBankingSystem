import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityNotice = () => {
  const securityTips = [
    {
      icon: 'Lock',
      title: 'Never share your login credentials',
      description: 'Keep your username and password confidential'
    },
    {
      icon: 'Wifi',
      title: 'Use secure networks only',
      description: 'Avoid public Wi-Fi for banking activities'
    },
    {
      icon: 'LogOut',
      title: 'Always sign out completely',
      description: 'Especially on shared or public computers'
    },
    {
      icon: 'AlertTriangle',
      title: 'Report suspicious activity',
      description: 'Contact us immediately if you notice anything unusual'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
          <Icon name="Shield" size={16} className="text-warning" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Security Reminders</h3>
      </div>
      <div className="space-y-4">
        {securityTips?.map((tip, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name={tip?.icon} size={12} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{tip?.title}</p>
              <p className="text-xs text-muted-foreground">{tip?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <Icon name="Phone" size={12} />
          <span>Need help? Call us 24/7 at (555) 123-BANK</span>
        </div>
      </div>
    </div>
  );
};

export default SecurityNotice;