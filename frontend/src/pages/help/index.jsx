import React from 'react';
import Header from '../../components/ui/Header';

const Help = () => (
  <div className="bg-background min-h-screen">
    <Header />
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-card border border-border rounded-xl p-6">
        <h1 className="text-xl font-semibold text-foreground mb-2">Help & Support</h1>
        <p className="text-sm text-muted-foreground">Browse FAQs or contact support for assistance.</p>
      </div>
    </div>
  </div>
);

export default Help;
