import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ResetPassword = () => {
  const [form, setForm] = useState({ code: '', newPassword: '', confirm: '' });
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.code || form.newPassword.length < 6 || form.newPassword !== form.confirm) {
      setError('Please provide a valid code and matching passwords (min 6 chars).');
      return;
    }
    await new Promise(r => setTimeout(r, 700));
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Lock" size={20} className="text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Reset Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter the code from email/SMS and choose a new password.</p>
          </div>

          {done ? (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-sm text-success">
                Password updated. You can now sign in with your new password.
              </div>
              <a href="/login">
                <Button fullWidth>
                  <Icon name="LogIn" size={16} className="mr-2" />
                  Go to Login
                </Button>
              </a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="p-3 bg-error/10 border border-error/20 rounded-lg text-sm text-error">{error}</div>
              )}
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Reset Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., 123456"
                  className="w-full pl-3 pr-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">New Password</label>
                <input
                  type="password"
                  required
                  className="w-full pl-3 pr-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="w-full pl-3 pr-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                />
              </div>
              <Button type="submit" fullWidth>
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Update Password
              </Button>
              <div className="text-center">
                <a href="/forgot-password" className="text-sm text-primary hover:text-primary/80">Resend code</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
