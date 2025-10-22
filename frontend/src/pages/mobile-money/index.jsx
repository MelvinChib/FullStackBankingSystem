import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import api from '../../services/api';

const providers = [
  { id: 'mtn', name: 'MTN MoMo', color: 'text-yellow-500', icon: 'Signal' },
  { id: 'airtel', name: 'Airtel Money', color: 'text-red-500', icon: 'Wifi' },
  { id: 'zamtel', name: 'Zamtel Kwacha', color: 'text-green-600', icon: 'Phone' },
];

const ProviderSelector = ({ value, onChange }) => (
  <div className="grid grid-cols-3 gap-3">
    {providers.map((p) => (
      <button
        key={p.id}
        onClick={() => onChange(p.id)}
        className={`border border-border rounded-lg p-3 text-center hover:bg-muted transition-colors ${
          value === p.id ? 'ring-2 ring-ring' : ''
        }`}
      >
        <Icon name={p.icon} size={18} className={`${p.color} mx-auto mb-2`} />
        <p className="text-xs text-foreground font-medium">{p.name}</p>
      </button>
    ))}
  </div>
);

const MobileMoneyTransfer = () => {
  const [form, setForm] = useState({ provider: 'mtn', phone: '', amount: '', reference: '' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const normalizeZMWPhone = (input) => {
    const digits = (input || '').replace(/\D/g, '');
    if (digits.startsWith('260') && digits.length === 12) {
      return '0' + digits.slice(3);
    }
    if (digits.length === 10 && digits.startsWith('0')) return digits;
    return null;
  };

  const validate = () => {
    const errs = {};
    const normalized = normalizeZMWPhone(form.phone);
    if (!normalized) errs.phone = 'Enter a valid Zambian number (e.g., 0970123456 or +260970123456)';
    if (!form.amount || Number.isNaN(parseFloat(form.amount)) || parseFloat(form.amount) <= 0) {
      errs.amount = 'Enter a valid amount greater than 0';
    }
    setErrors(errs);
    return { ok: Object.keys(errs).length === 0, normalizedPhone: normalized };
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    const { ok, normalizedPhone } = validate();
    if (!ok) return;
    try {
      setStatus('loading');
      await api.sendMobileMoneyTransfer({
        provider: form.provider,
        phone: normalizedPhone,
        currency: 'ZMW',
        amount: parseFloat(form.amount),
        reference: form.reference || undefined,
      });
      setStatus('success');
      setMessage('Transfer submitted. You may receive an authorization prompt on your phone.');
      setForm({ provider: form.provider, phone: '', amount: '', reference: '' });
      setErrors({});
    } catch (err) {
      setStatus('idle');
      setMessage(err?.message || 'Failed to submit transfer');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Send to Mobile Wallet</h3>
      <div className="mb-4">
        <ProviderSelector value={form.provider} onChange={(v) => setForm({ ...form, provider: v })} />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Phone Number</label>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="e.g., 0970 123 456 or +260 970 123 456"
            className={`w-full pl-3 pr-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Amount (ZMW)</label>
            <input
              type="number"
              step="0.01"
              placeholder="0.00"
              className={`w-full pl-3 pr-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.amount ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              required
              min="0.01"
            />
            {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-sm text-muted-foreground mb-1">Reference</label>
            <input
              type="text"
              placeholder="Optional note"
              className="w-full pl-3 pr-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={form.reference}
              onChange={(e) => setForm({ ...form, reference: e.target.value })}
            />
          </div>
        </div>
        <Button type="submit" loading={status === 'loading'} className="w-full h-11" disabled={status === 'loading'}>
          <Icon name="Send" size={16} className="mr-2" />
          Send Money
        </Button>
        {message && (
          <div className={`text-sm rounded-lg p-3 border ${status === 'success' ? 'text-success bg-success/10 border-success/20' : 'text-destructive bg-destructive/10 border-destructive/20'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

const AirtimePurchase = () => {
  const [form, setForm] = useState({ provider: 'mtn', phone: '', amount: '10' });
  const [status, setStatus] = useState('idle');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const normalizeZMWPhone = (input) => {
    const digits = (input || '').replace(/\D/g, '');
    if (digits.startsWith('260') && digits.length === 12) {
      return '0' + digits.slice(3);
    }
    if (digits.length === 10 && digits.startsWith('0')) return digits;
    return null;
  };

  const validate = () => {
    const errs = {};
    const normalized = normalizeZMWPhone(form.phone);
    if (!normalized) errs.phone = 'Enter a valid Zambian number (e.g., 0970123456 or +260970123456)';
    if (!form.amount || Number.isNaN(parseFloat(form.amount)) || parseFloat(form.amount) < 5) {
      errs.amount = 'Minimum airtime purchase is ZMW 5';
    }
    setErrors(errs);
    return { ok: Object.keys(errs).length === 0, normalizedPhone: normalized };
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage('');
    const { ok, normalizedPhone } = validate();
    if (!ok) return;
    try {
      setStatus('loading');
      await api.buyAirtime({
        provider: form.provider,
        phone: normalizedPhone,
        currency: 'ZMW',
        amount: parseFloat(form.amount),
      });
      setStatus('success');
      setMessage('Airtime top-up successful.');
      setForm({ provider: form.provider, phone: '', amount: '10' });
      setErrors({});
    } catch (err) {
      setStatus('idle');
      setMessage(err?.message || 'Failed to purchase airtime');
    }
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Buy Airtime</h3>
      <div className="mb-4">
        <ProviderSelector value={form.provider} onChange={(v) => setForm({ ...form, provider: v })} />
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Phone Number</label>
          <input
            type="tel"
            placeholder="e.g., 0970 123 456 or +260 970 123 456"
            className={`w-full pl-3 pr-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.phone ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm text-muted-foreground mb-1">Amount (ZMW)</label>
          <input
            type="number"
            className={`w-full pl-3 pr-3 py-2 border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${errors.amount ? 'border-destructive focus:ring-destructive' : 'border-border'}`}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            min="5"
            required
          />
          {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
        </div>
        <Button type="submit" loading={status === 'loading'} className="w-full h-11" variant="secondary" disabled={status === 'loading'}>
          <Icon name="Phone" size={16} className="mr-2" />
          Purchase Airtime
        </Button>
        {message && (
          <div className={`text-sm rounded-lg p-3 border ${status === 'success' ? 'text-success bg-success/10 border-success/20' : 'text-destructive bg-destructive/10 border-destructive/20'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

const TransactionHistory = () => {
  const items = [
    { id: '1', type: 'Send', amount: -150.0, provider: 'MTN', phone: '0970•••3456', date: 'Today' },
    { id: '2', type: 'Airtime', amount: -20.0, provider: 'Airtel', phone: '0966•••2211', date: 'Yesterday' },
    { id: '3', type: 'Cash-In', amount: 500.0, provider: 'Zamtel', phone: '0955•••7890', date: 'Sep 10' },
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Recent Mobile Money</h3>
      <div className="space-y-2">
        {items.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <Icon name={t.type === 'Airtime' ? 'Phone' : t.amount > 0 ? 'TrendingUp' : 'TrendingDown'} size={16} className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.type} • {t.provider}</p>
                <p className="text-xs text-muted-foreground">{t.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${t.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                {t.amount > 0 ? '+' : '-'}ZMW {Math.abs(t.amount).toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">{t.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MobileMoney = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Mobile Money</h1>
            <p className="text-sm text-muted-foreground">Cash in/out, transfer to wallet, and buy airtime.</p>
          </div>
          <a href="/account-dashboard">
            <Button variant="outline">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </a>
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 space-y-6">
            <MobileMoneyTransfer />
            <AirtimePurchase />
          </div>
          <div>
            <TransactionHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMoney;
