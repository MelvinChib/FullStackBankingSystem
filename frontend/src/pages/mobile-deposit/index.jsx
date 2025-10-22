import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const MobileDeposit = () => (
  <div className="bg-background min-h-screen">
    <Header />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Icon name="Camera" size={18} className="text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Mobile Check Deposit</h1>
        </div>
        <p className="text-sm text-muted-foreground">Use your camera to deposit checks. (Demo placeholder)</p>
      </div>
    </div>
  </div>
);

export default MobileDeposit;
