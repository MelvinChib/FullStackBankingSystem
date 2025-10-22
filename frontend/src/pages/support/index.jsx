import React from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import CustomerSupport from '../../components/CustomerSupport';

export default function Support() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="MessageSquare" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">Customer Support</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/">
                <Button variant="outline" iconName="Home">Dashboard</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <CustomerSupport />
        </div>
      </main>
    </div>
  );
}
