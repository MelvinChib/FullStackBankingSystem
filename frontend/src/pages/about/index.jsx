import React from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const About = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card border border-border rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-3">
                <Icon name="Building2" size={18} className="text-primary" />
                <h1 className="text-2xl font-semibold text-foreground">About BankingHub</h1>
              </div>
              <p className="text-sm text-muted-foreground">
                BankingHub delivers secure, modern digital banking designed for Zambia. With instant transfers, Mobile Money
                integrations, and smart budgeting tools, we help you manage your finances with confidence and ease.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {[
                  { icon: 'Shield', title: 'Secure by Design', desc: 'Industry-grade encryption, 2FA, and active monitoring.' },
                  { icon: 'Zap', title: 'Fast & Reliable', desc: 'Instant transfers and real-time updates you can rely on.' },
                  { icon: 'Smartphone', title: 'Mobile Money', desc: 'MTN MoMo, Airtel Money, and Zamtel Kwacha support.' },
                  { icon: 'PieChart', title: 'Smart Insights', desc: 'Clear dashboards and budgets that work for you.' },
                ].map(f => (
                  <div key={f.title} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Icon name={f.icon} size={18} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{f.title}</p>
                      <p className="text-xs text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-foreground mb-2">Our Commitment</h2>
              <p className="text-sm text-muted-foreground">
                We commit to transparency, security, and inclusion. We continuously invest in infrastructure and customer support
                to deliver the highest quality service.
              </p>
              <div className="mt-6 flex gap-3">
                <a href="/register">
                  <Button>
                    <Icon name="UserPlus" size={16} className="mr-2" /> Open an Account
                  </Button>
                </a>
                <a href="/login">
                  <Button variant="outline">
                    <Icon name="LogIn" size={16} className="mr-2" /> Sign In
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Contact</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2"><Icon name="Phone" size={14} /> <span>(555) 123-BANK</span></div>
                <div className="flex items-center gap-2"><Icon name="Mail" size={14} /> <span>support@bankinghub.com</span></div>
                <div className="flex items-center gap-2"><Icon name="MapPin" size={14} /> <span>123 Banking St, Finance City</span></div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6">
              <h3 className="text-base font-semibold text-foreground mb-2">Compliance</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                <li>FDIC-equivalent coverage for deposits (demo)</li>
                <li>Data protection aligned with best practices</li>
                <li>Continuous internal security reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
