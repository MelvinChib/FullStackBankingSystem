import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import TwoFactorAuth from './components/TwoFactorAuth';
import SecurityNotice from './components/SecurityNotice';
import Button from '../../components/ui/Button';


const Login = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('login'); // 'login' or '2fa'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Mock credentials for testing
  const mockCredentials = {
    email: 'demo@bankinghub.com',
    password: 'demo123',
    twoFactorCode: '123456'
  };

  useEffect(() => {
    // Check for existing session
    const existingSession = localStorage.getItem('bankingSession');
    if (existingSession) {
      navigate('/account-dashboard');
    }

    // Set up session timeout warning
    const timeout = setTimeout(() => {
      setSessionTimeout(true);
    }, 1800000); // 30 minutes

    return () => clearTimeout(timeout);
  }, [navigate]);

  const handleLogin = async (formData) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Validate credentials
      if (formData?.email !== mockCredentials?.email || formData?.password !== mockCredentials?.password) {
        throw new Error('Invalid email or password. Please try demo@bankinghub.com with password demo123');
      }

      // Check if 2FA is enabled (simulate based on email)
      const requires2FA = formData?.email?.includes('demo');
      
      if (requires2FA) {
        setCurrentStep('2fa');
      } else {
        // Direct login success
        handleLoginSuccess(formData);
      }
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorVerify = async (code) => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate 2FA code
      if (code !== mockCredentials?.twoFactorCode) {
        throw new Error('Invalid verification code. Please use 123456 for demo');
      }

      handleLoginSuccess({ email: mockCredentials?.email });
    } catch (err) {
      setError(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    // Store session data
    const sessionData = {
      user: {
        id: '1',
        name: 'John Smith',
        email: userData?.email,
        accountNumber: '****1234',
        lastLogin: new Date()?.toISOString()
      },
      timestamp: new Date()?.toISOString(),
      expiresAt: new Date(Date.now() + 1800000)?.toISOString() // 30 minutes
    };

    localStorage.setItem('bankingSession', JSON.stringify(sessionData));
    
    // Navigate to dashboard
    navigate('/account-dashboard');
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Simulate resend API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setError('');
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground">BankingHub</span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="Shield" size={16} className="text-success" />
                <span className="hidden sm:inline">Secure Login</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Phone" size={16} />
                <span className="hidden md:inline">(555) 123-BANK</span>
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Login Form */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="bg-card border border-border rounded-lg shadow-sm p-8">
                {currentStep === 'login' ? (
                  <>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="LogIn" size={24} className="text-primary" />
                      </div>
                      <h1 className="text-2xl font-semibold text-foreground mb-2">
                        Welcome Back
                      </h1>
                      <p className="text-muted-foreground">
                        Sign in to access your banking dashboard
                      </p>
                    </div>

                    <LoginForm
                      onLogin={handleLogin}
                      isLoading={isLoading}
                      error={error}
                    />
                  </>
                ) : (
                  <TwoFactorAuth
                    onVerify={handleTwoFactorVerify}
                    onResend={handleResendCode}
                    isLoading={isLoading}
                    error={error}
                  />
                )}
              </div>

              {/* Demo Credentials Notice */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-primary mb-1">Demo Credentials</p>
                    <p className="text-muted-foreground text-xs">
                      Email: demo@bankinghub.com<br />
                      Password: demo123<br />
                      2FA Code: 123456
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Trust Signals & Security */}
            <div className="space-y-6">
              <TrustSignals />
              <SecurityNotice />
              
              {/* Additional Features */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Why Choose BankingHub?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Zap" size={16} className="text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Instant Transfers</p>
                      <p className="text-xs text-muted-foreground">Move money in real-time</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="PieChart" size={16} className="text-secondary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Smart Budgeting</p>
                      <p className="text-xs text-muted-foreground">Track spending automatically</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="Smartphone" size={16} className="text-accent" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Mobile Banking</p>
                      <p className="text-xs text-muted-foreground">Bank anywhere, anytime</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon name="HeadphonesIcon" size={16} className="text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">24/7 Support</p>
                      <p className="text-xs text-muted-foreground">Always here to help</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Icon name="Building2" size={14} color="white" />
                </div>
                <span className="font-semibold text-foreground">BankingHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner for secure digital banking and financial management.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Quick Links</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/about" className="block hover:text-foreground transition-colors">About Us</a>
                <a href="/security" className="block hover:text-foreground transition-colors">Security</a>
                <a href="/privacy" className="block hover:text-foreground transition-colors">Privacy Policy</a>
                <a href="/terms" className="block hover:text-foreground transition-colors">Terms of Service</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-foreground mb-3">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Icon name="Phone" size={14} />
                  <span>(555) 123-BANK</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Mail" size={14} />
                  <span>support@bankinghub.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>123 Banking St, Finance City</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              © {new Date()?.getFullYear()} BankingHub. All rights reserved. Member FDIC.
            </p>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center space-x-1 text-xs text-success">
                <Icon name="Shield" size={12} />
                <span>FDIC Insured</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-primary">
                <Icon name="Lock" size={12} />
                <span>SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* Session Timeout Warning */}
      {sessionTimeout && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-300">
          <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-warning rounded-full flex items-center justify-center">
                <Icon name="Clock" size={20} color="white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Session Timeout</h3>
                <p className="text-sm text-muted-foreground">
                  For your security, please sign in again
                </p>
              </div>
            </div>
            <p className="text-sm text-foreground mb-6">
              Your session has expired due to inactivity. This helps protect your account from unauthorized access.
            </p>
            <Button
              variant="default"
              onClick={() => setSessionTimeout(false)}
              fullWidth
            >
              Continue to Sign In
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;