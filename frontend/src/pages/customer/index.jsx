import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

const Customer = () => (
  <div className="bg-background min-h-screen">
    <Header />
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Users" size={18} className="text-primary" />
            <h1 className="text-xl font-semibold text-foreground">For Our Customers</h1>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            We’re committed to delivering a world-class digital banking experience built on security, speed, and simplicity.
          </p>
          <div className="space-y-4">
            {[
              { icon: 'Shield', title: 'Security First', desc: 'Two-factor authentication, encrypted sessions, and continuous monitoring.' },
              { icon: 'Zap', title: 'Fast Payments', desc: 'Instant transfers between accounts and leading mobile money providers.' },
              { icon: 'PieChart', title: 'Smart Insights', desc: 'Track your spending and budgets with intuitive charts and alerts.' },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon name={f.icon} size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.title}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">Need Help?</h2>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Icon name="Phone" size={14} />
              <span>(555) 123-BANK</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Mail" size={14} />
              <span>support@bankinghub.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="MessageSquare" size={14} />
              <a href="/help" className="text-primary hover:text-primary/80">Visit Help Center</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Customer;
