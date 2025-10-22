import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Auth from '../../services/auth';

const Profile = () => {
  const session = Auth.getSession();
  const user = session?.user || { name: '', email: '', phone: '', address: '' };
  const [form, setForm] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    address: user.address || '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const saveProfile = () => {
    const next = { ...(session || {}), user: { ...(user || {}), name: form.name, phone: form.phone, address: form.address } };
    Auth.login(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const changePassword = () => {
    setError('');
    if (form.newPassword.length < 6 || form.newPassword !== form.confirmPassword) {
      setError('Passwords must match and be at least 6 characters.');
      return;
    }
    // In real app, call backend; here we just simulate success
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setForm((f) => ({ ...f, oldPassword: '', newPassword: '', confirmPassword: '' }));
  };

  return (
    <div className="bg-background min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-card border border-border rounded-xl p-6">
          <h1 className="text-xl font-semibold text-foreground mb-2">Profile</h1>
          <p className="text-sm text-muted-foreground mb-4">Manage your personal information and security settings.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Full name</label>
              <input className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.name} onChange={(e)=>update('name', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email</label>
              <input className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground opacity-70" value={form.email} disabled />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Phone</label>
                <input className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.phone} onChange={(e)=>update('phone', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Address</label>
                <input className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.address} onChange={(e)=>update('address', e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile}>Save Profile</Button>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-foreground mb-3">Change Password</h2>
          {error && (
            <div className="text-sm text-error bg-error/10 border border-error/20 rounded-lg p-3 mb-3">{error}</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Current password</label>
              <input type="password" className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.oldPassword} onChange={(e)=>update('oldPassword', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">New password</label>
              <input type="password" className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.newPassword} onChange={(e)=>update('newPassword', e.target.value)} />
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Confirm new password</label>
              <input type="password" className="w-full px-3 py-2 border border-border rounded-lg bg-input text-foreground" value={form.confirmPassword} onChange={(e)=>update('confirmPassword', e.target.value)} />
            </div>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={changePassword}>Update Password</Button>
          </div>
        </div>

        {saved && (
          <div className="text-sm text-success bg-success/10 border border-success/20 rounded-lg p-3">Changes saved</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
