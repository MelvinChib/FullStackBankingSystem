import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const TwoFactorAuth = ({ onVerify, onResend, isLoading, error }) => {
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds?.toString()?.padStart(2, '0')}`;
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (code?.length === 6) {
      onVerify(code);
    }
  };

  const handleResend = () => {
    setTimeLeft(300);
    setCanResend(false);
    setCode('');
    onResend();
  };

  const handleCodeChange = (e) => {
    const value = e?.target?.value?.replace(/\D/g, '')?.slice(0, 6);
    setCode(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Smartphone" size={24} className="text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Two-Factor Authentication
        </h2>
        <p className="text-sm text-muted-foreground">
          We've sent a 6-digit verification code to your registered mobile device.
          Enter the code below to complete your sign in.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Verification Code"
          type="text"
          value={code}
          onChange={handleCodeChange}
          placeholder="Enter 6-digit code"
          maxLength={6}
          className="text-center text-lg tracking-widest font-mono"
          disabled={isLoading}
        />

        {error && (
          <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <Button
          type="submit"
          variant="default"
          size="lg"
          fullWidth
          loading={isLoading}
          disabled={isLoading || code?.length !== 6}
          className="h-12"
        >
          Verify & Sign In
        </Button>
      </form>
      <div className="text-center space-y-3">
        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>Code expires in {formatTime(timeLeft)}</span>
        </div>

        <div className="flex items-center justify-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="text-primary"
          >
            <Icon name="RefreshCw" size={16} className="mr-1" />
            Resend Code
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history?.back()}
            disabled={isLoading}
            className="text-muted-foreground"
          >
            <Icon name="ArrowLeft" size={16} className="mr-1" />
            Back to Login
          </Button>
        </div>
      </div>
      <div className="bg-muted/30 rounded-lg p-4 border border-border">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Didn't receive the code?</p>
            <ul className="space-y-1">
              <li>• Check your SMS messages and spam folder</li>
              <li>• Ensure your phone has signal</li>
              <li>• Wait a few moments for delivery</li>
              <li>• Contact support if issues persist</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorAuth;