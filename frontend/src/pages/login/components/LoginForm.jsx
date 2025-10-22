import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const LoginForm = ({ onLogin, isLoading, error }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  
  const isDemoEnabled = import.meta.env.VITE_ENABLE_DEMO === 'true';
  const demoEmail = import.meta.env.VITE_DEMO_EMAIL || 'demo@swiftbank.com';
  const demoPassword = import.meta.env.VITE_DEMO_PASSWORD || 'Demo123!';

  const validateForm = () => {
    const errors = {};
    
    if (!formData?.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData?.password) {
      errors.password = 'Password is required';
    } else if (formData?.password?.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors)?.length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e?.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear validation error when user starts typing
    if (validationErrors?.[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (validateForm()) {
      onLogin(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {isDemoEnabled && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-2">
            <Icon name="Info" size={18} className="text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">Demo Mode Enabled</h3>
              <p className="text-xs text-blue-700 mb-2">Use these credentials to explore the app:</p>
              <div className="bg-white rounded border border-blue-200 p-2 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Email:</span>
                  <code className="text-xs font-mono text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{demoEmail}</code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">Password:</span>
                  <code className="text-xs font-mono text-blue-900 bg-blue-50 px-2 py-0.5 rounded">{demoPassword}</code>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-4">
        <div>
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={formData?.email}
            onChange={handleInputChange}
            placeholder="example@email.com"
            error={validationErrors?.email}
            required
            disabled={isLoading}
            className="w-full"
          />
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Info" size={12} />
            Enter a valid email address (e.g., user@domain.com)
          </p>
        </div>

        <div>
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData?.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              error={validationErrors?.password}
              required
              disabled={isLoading}
              className="w-full pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors"
              disabled={isLoading}
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={20} />
            </button>
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1">
            <Icon name="Info" size={12} />
            Password must be at least 6 characters long
          </p>
        </div>
      </div>
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error">
          <Icon name="AlertCircle" size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}
      <div className="flex items-center justify-between">
        <Checkbox
          label="Remember me"
          name="rememberMe"
          checked={formData?.rememberMe}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        
        <a
          href="/forgot-password"
          className="text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Forgot password?
        </a>
      </div>
      <Button
        type="submit"
        variant="default"
        size="lg"
        fullWidth
        loading={isLoading}
        disabled={isLoading}
        className="h-12"
      >
        Sign In
      </Button>
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a
            href="/register"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Create Account
          </a>
        </span>
      </div>
    </form>
  );
};

export default LoginForm;