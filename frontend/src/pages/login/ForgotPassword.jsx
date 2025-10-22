import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    await new Promise(r => setTimeout(r, 600));
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card border border-border rounded-xl p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="KeyRound" size={20} className="text-primary" />
            </div>
            <h1 className="text-xl font-semibold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a reset link or code.</p>
          </div>

          {sent ? (
            <div className="space-y-4">
              <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-sm text-success">
                If an account exists for {email}, you’ll receive a message with reset instructions.
              </div>
              <a href="/reset-password">
                <Button variant="outline" fullWidth>
                  <Icon name="Mail" size={16} className="mr-2" />
                  Enter Reset Code
                </Button>
              </a>
              <a href="/login" className="block text-center text-sm text-primary hover:text-primary/80">Back to login</a>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Email address</label>
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full pl-3 pr-3 py-2 border border-border rounded-lg bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" fullWidth>
                <Icon name="Send" size={16} className="mr-2" />
                Send Reset Instructions
              </Button>
              <div className="text-center">
                <a href="/login" className="text-sm text-primary hover:text-primary/80">Back to login</a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
