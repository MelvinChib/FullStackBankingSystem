import React from 'react';
import Header from '../../components/ui/Header';
import StatementExport from '../../components/StatementExport';

const Statements = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-foreground">Statements</h1>
          <p className="text-sm text-muted-foreground">Download your account statements in PDF, CSV, or Text format.</p>
        </div>
        <StatementExport />
      </div>
    </div>
  );
};

export default Statements;
