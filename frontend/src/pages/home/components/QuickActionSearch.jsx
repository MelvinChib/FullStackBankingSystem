import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Auth from '../../../services/auth';

const actions = [
  { label: 'Open an account', icon: 'UserPlus', href: '/register' },
  { label: 'Log in', icon: 'LogIn', href: '/login' },
  { label: 'Transfer money', icon: 'ArrowLeftRight', href: '/transfer-funds', permission: 'TRANSFER_FUNDS' },
  { label: 'Pay a bill', icon: 'Receipt', href: '/bill-pay', permission: 'BILL_PAY' },
  { label: 'Mobile deposit', icon: 'Camera', href: '/mobile-deposit', permission: 'MOBILE_DEPOSIT' },
  { label: 'Mobile money', icon: 'Smartphone', href: '/mobile-money', permission: 'MOBILE_MONEY' },
  { label: 'View statements', icon: 'FileText', href: '/statements', permission: 'VIEW_STATEMENTS' },
  { label: 'Find a branch', icon: 'MapPin', href: '/help?topic=branches' },
  { label: 'Credit cards', icon: 'CreditCard', href: '/login' },
  { label: 'Home loans', icon: 'Home', href: '/login' },
  { label: 'Support', icon: 'HelpCircle', href: '/support', permission: 'VIEW_SUPPORT' },
];

export default function QuickActionSearch() {
  const [q, setQ] = useState('');
  const authed = Auth.isAuthenticated();
  const perms = Auth.getSession()?.user?.permissions || [];

  const filtered = useMemo(() => {
    const list = actions.filter(a => a.label.toLowerCase().includes(q.trim().toLowerCase()));
    return list.map(a => {
      if (a.permission && (!authed || !perms.includes(a.permission))) {
        return { ...a, href: '/login' };
      }
      return a;
    }).slice(0, 6);
  }, [q, authed, perms]);

  return (
    <div className="mt-4">
      <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm max-w-xl">
        <div className="flex items-center gap-2">
          <Icon name="Search" size={18} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What would you like to do? (e.g., Transfer money)"
            className="w-full outline-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        {filtered.length > 0 && (
          <div className="mt-3 divide-y divide-gray-100">
            {filtered.map((a, idx) => (
              <a key={idx} href={a.href} className="flex items-center justify-between py-2 px-1 hover:bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Icon name={a.icon} size={16} className="text-blue-700" />
                  <span className="text-sm text-foreground">{a.label}</span>
                </div>
                <Icon name="ArrowRight" size={14} className="text-muted-foreground" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
