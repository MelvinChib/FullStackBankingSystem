import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import ApiService from '../../services/api';

const AccountOpeningForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    // Personal Info
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    nationalId: '',
    nationality: 'ZM',
    // Contact
    email: '',
    phoneNumber: '',
    // Address
    addressLine1: '',
    addressLine2: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'ZM',
    // Account
    accountType: 'CHECKING',
    currency: 'ZMW',
    initialDeposit: '',
    // Employment & KYC
    employmentStatus: 'employed',
    employerName: '',
    monthlyIncomeRange: '0-10000',
    sourceOfFunds: 'salary',
    isPEP: false,
    taxResidentUS: false,
    // Security
    password: '',
    confirmPassword: '',
    // Consents
    acceptTerms: false,
    acceptPrivacy: false,
    marketingConsent: false,
  });

  const accountTypeOptions = [
    { value: 'CHECKING', label: 'Checking Account' },
    { value: 'SAVINGS', label: 'Savings Account' },
    { value: 'FIXED', label: 'Fixed Deposit' },
  ];

  const employmentOptions = [
    { value: 'employed', label: 'Employed' },
    { value: 'self_employed', label: 'Self-Employed' },
    { value: 'student', label: 'Student' },
    { value: 'unemployed', label: 'Unemployed' },
    { value: 'retired', label: 'Retired' },
  ];

  const incomeOptions = [
    { value: '0-10000', label: 'Below ZMW 10,000' },
    { value: '10000-30000', label: 'ZMW 10,000 - 30,000' },
    { value: '30000-60000', label: 'ZMW 30,000 - 60,000' },
    { value: '60000+', label: 'Above ZMW 60,000' },
  ];

  const sourceOfFundsOptions = [
    { value: 'salary', label: 'Salary' },
    { value: 'business', label: 'Business Income' },
    { value: 'savings', label: 'Savings' },
    { value: 'investment', label: 'Investments' },
    { value: 'gift', label: 'Gift/Donation' },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e) => {
    const { name, type } = e.target;
    const value = type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Real-time validation for specific fields
    if (type !== 'checkbox' && value) {
      const error = validateField(name, value);
      if (error) {
        setFieldErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  };

  const handleSelect = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const [fieldErrors, setFieldErrors] = useState({});

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value || value.trim().length < 2) return 'Must be at least 2 characters';
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return 'Only letters, spaces, hyphens, and apostrophes allowed';
        break;
      case 'email':
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format (e.g., user@example.com)';
        break;
      case 'phoneNumber':
        if (!value) return 'Phone number is required';
        if (!/^\+?[0-9\s-]{7,20}$/.test(value)) return 'Invalid phone format (e.g., +260 97 1234567)';
        break;
      case 'nationalId':
        if (value && !/^[a-zA-Z0-9\/\s-]{5,20}$/.test(value)) return 'Invalid ID format';
        break;
      case 'password':
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Must be at least 8 characters';
        if (!/[A-Z]/.test(value)) return 'Must include uppercase letter';
        if (!/[a-z]/.test(value)) return 'Must include lowercase letter';
        if (!/[0-9]/.test(value)) return 'Must include a number';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return 'Must include special character';
        break;
      case 'confirmPassword':
        if (value !== form.password) return 'Passwords do not match';
        break;
      case 'addressLine1':
        if (!value || value.trim().length < 5) return 'Address must be at least 5 characters';
        break;
      case 'city':
        if (!value || value.trim().length < 2) return 'City name required';
        break;
      case 'postalCode':
        if (value && !/^[0-9]{4,10}$/.test(value)) return 'Invalid postal code (4-10 digits)';
        break;
      case 'initialDeposit':
        if (value && (isNaN(value) || parseFloat(value) < 0)) return 'Must be a positive number';
        if (value && parseFloat(value) > 0 && parseFloat(value) < 100) return 'Minimum deposit is 100';
        break;
    }
    return '';
  };

  const validate = () => {
    const errors = {};
    
    // Required fields
    if (!form.firstName) errors.firstName = 'First name is required';
    else if (validateField('firstName', form.firstName)) errors.firstName = validateField('firstName', form.firstName);
    
    if (!form.lastName) errors.lastName = 'Last name is required';
    else if (validateField('lastName', form.lastName)) errors.lastName = validateField('lastName', form.lastName);
    
    const emailError = validateField('email', form.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validateField('phoneNumber', form.phoneNumber);
    if (phoneError) errors.phoneNumber = phoneError;
    
    const passwordError = validateField('password', form.password);
    if (passwordError) errors.password = passwordError;
    
    const confirmError = validateField('confirmPassword', form.confirmPassword);
    if (confirmError) errors.confirmPassword = confirmError;
    
    if (!form.addressLine1) errors.addressLine1 = 'Address is required';
    else if (validateField('addressLine1', form.addressLine1)) errors.addressLine1 = validateField('addressLine1', form.addressLine1);
    
    if (!form.city) errors.city = 'City is required';
    else if (validateField('city', form.city)) errors.city = validateField('city', form.city);
    
    if (!form.country) errors.country = 'Country is required';
    
    if (!form.acceptTerms) errors.acceptTerms = 'You must accept the Terms of Service';
    if (!form.acceptPrivacy) errors.acceptPrivacy = 'You must accept the Privacy Policy';
    
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return Object.values(errors)[0]; // Return first error
    }
    return '';
  };

  const buildBackendPayload = () => {
    const address = [form.addressLine1, form.addressLine2, form.city, form.province, form.postalCode, form.country]
      .filter(Boolean)
      .join(', ');
    return {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      password: form.password,
      phoneNumber: form.phoneNumber,
      address,
    };
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildBackendPayload();
      await ApiService.register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please login with your credentials.',
            email: form.email 
          } 
        });
      }, 2000);
    } catch (err) {
      setError(err?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Form */}
      <div className="lg:col-span-2">
        <form onSubmit={onSubmit} className="bg-white/90 backdrop-blur rounded-2xl shadow-xl ring-1 ring-black/5 p-8 space-y-8 animate-fade-in">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">Open a New Account</h1>
            <p className="text-sm text-muted-foreground">Complete the form below to apply for a MelCredit Union Bank account.</p>
          </div>

          {error && (
            <div className="relative overflow-hidden rounded-xl border-2 border-red-400 bg-gradient-to-r from-red-50 to-red-100 p-5 shadow-lg animate-shake">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <Icon name="AlertCircle" size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-red-800 mb-1">⚠️ Oops! Something went wrong</h3>
                  <p className="text-sm text-red-700 leading-relaxed">{error}</p>
                </div>
              </div>
            </div>
          )}
          
          {Object.keys(fieldErrors).length > 0 && !error && (
            <div className="relative overflow-hidden rounded-xl border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-100 p-5 shadow-lg">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center shadow-md">
                  <Icon name="AlertTriangle" size={22} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-amber-900 mb-3">📝 Please review the following:</h3>
                  <div className="space-y-2">
                    {Object.entries(fieldErrors).map(([field, err]) => err && (
                      <div key={field} className="flex items-start space-x-2 bg-white/60 rounded-lg p-2">
                        <Icon name="ChevronRight" size={16} className="text-amber-600 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-amber-800">
                          <span className="font-semibold">{field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span> {err}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {success && (
            <div className="relative overflow-hidden rounded-xl border-2 border-green-400 bg-gradient-to-r from-green-50 to-emerald-100 p-5 shadow-lg animate-bounce-in">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -mr-16 -mt-16 opacity-50"></div>
              <div className="relative flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  <Icon name="CheckCircle2" size={26} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-green-800 mb-1">🎉 Success!</h3>
                  <p className="text-sm text-green-700 leading-relaxed">{success}</p>
                  <div className="mt-3 flex items-center space-x-2 text-xs text-green-600">
                    <div className="animate-spin">
                      <Icon name="Loader2" size={14} />
                    </div>
                    <span>Preparing your account...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Personal Information */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon name="User" size={16} className="text-blue-700" />
              </div>
              <h2 className="text-lg font-semibold">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" description="Enter your legal first name" error={fieldErrors.firstName} />
              <Input label="Middle Name (optional)" name="middleName" value={form.middleName} onChange={handleChange} placeholder="Michael" />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" description="Enter your legal last name" error={fieldErrors.lastName} />
              <Input label="Date of Birth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} description="Must be 18 years or older" />
              <Input label="National ID / Passport" name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="123456/78/9" description="Enter your NRC or passport number" error={fieldErrors.nationalId} />
            </div>
          </section>

          {/* Contact Details */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Icon name="Phone" size={16} className="text-green-700" />
              </div>
              <h2 className="text-lg font-semibold">Contact Details</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john.doe@example.com" description="We'll send your account details here" error={fieldErrors.email} />
              <Input label="Mobile Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required placeholder="+260 97 1234567" description="Include country code (e.g., +260)" error={fieldErrors.phoneNumber} />
            </div>
          </section>

          {/* Residential Address */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Icon name="MapPin" size={16} className="text-amber-700" />
              </div>
              <h2 className="text-lg font-semibold">Residential Address</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required placeholder="123 Main Street" description="Street address or P.O. Box" error={fieldErrors.addressLine1} />
              <Input label="Address Line 2 (optional)" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Apt 4B" />
              <Input label="City" name="city" value={form.city} onChange={handleChange} required placeholder="Lusaka" error={fieldErrors.city} />
              <Input label="Province / State" name="province" value={form.province} onChange={handleChange} placeholder="Lusaka Province" />
              <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10101" error={fieldErrors.postalCode} />
              <Input label="Country" name="country" value={form.country} onChange={handleChange} placeholder="Zambia" description="Full country name" />
            </div>
          </section>

          {/* Account Preferences */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                <Icon name="Settings" size={16} className="text-purple-700" />
              </div>
              <h2 className="text-lg font-semibold">Account Preferences</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Account Type"
                value={form.accountType}
                options={accountTypeOptions}
                onChange={(val) => handleSelect('accountType', val)}
                required
              />
              <Select
                label="Currency"
                value={form.currency}
                options={[{ value: 'ZMW', label: 'Zambian Kwacha (ZMW)' }, { value: 'USD', label: 'US Dollar (USD)' }]}
                onChange={(val) => handleSelect('currency', val)}
                required
              />
              <Input label="Initial Deposit (optional)" type="number" name="initialDeposit" value={form.initialDeposit} onChange={handleChange} placeholder="1000" description="Minimum ZMW 100 recommended" error={fieldErrors.initialDeposit} />
            </div>
          </section>

          {/* Employment & KYC */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Icon name="Briefcase" size={16} className="text-cyan-700" />
              </div>
              <h2 className="text-lg font-semibold">Employment & KYC</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select label="Employment Status" value={form.employmentStatus} options={employmentOptions} onChange={(v) => handleSelect('employmentStatus', v)} />
              <Input label="Employer / Business Name" name="employerName" value={form.employerName} onChange={handleChange} placeholder="ABC Company Ltd" description="Leave blank if unemployed" />
              <Select label="Monthly Income Range" value={form.monthlyIncomeRange} options={incomeOptions} onChange={(v) => handleSelect('monthlyIncomeRange', v)} />
              <Select label="Source of Funds" value={form.sourceOfFunds} options={sourceOfFundsOptions} onChange={(v) => handleSelect('sourceOfFunds', v)} />
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Checkbox label="I am a Politically Exposed Person (PEP)" name="isPEP" checked={form.isPEP} onChange={handleChange} />
                <Checkbox label="I am a U.S. tax resident (FATCA)" name="taxResidentUS" checked={form.taxResidentUS} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Icon name="Lock" size={16} className="text-red-700" />
              </div>
              <h2 className="text-lg font-semibold">Security</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Create Password" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" description="Min 8 chars: uppercase, lowercase, number, special char" error={fieldErrors.password} />
              <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="••••••••" description="Re-enter your password" error={fieldErrors.confirmPassword} />
            </div>
          </section>

          {/* Consents */}
          <section className="space-y-3">
            <Checkbox label="I agree to the Terms of Service" name="acceptTerms" checked={form.acceptTerms} onChange={handleChange} required />
            <Checkbox label="I have read and agree to the Privacy Policy" name="acceptPrivacy" checked={form.acceptPrivacy} onChange={handleChange} required />
            <Checkbox label="I agree to receive updates and promotional materials (optional)" name="marketingConsent" checked={form.marketingConsent} onChange={handleChange} />
          </section>

          <div className="flex items-center gap-3">
            <Button type="submit" size="xl" loading={isSubmitting} iconName="Check" className="h-12 rounded-full px-8">
              Submit Application
            </Button>
            <Button type="button" variant="outline" size="xl" iconName="RotateCcw" className="rounded-full px-8" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>

      {/* Requirements & Visuals */}
      <aside className="space-y-6 lg:sticky lg:top-24">
        {/* Hero/visual card */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=1200&auto=format&fit=crop"
            alt="Banking"
            className="h-40 w-full object-cover opacity-90"
            loading="lazy"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold">Bank with Confidence</h3>
            <p className="text-sm text-muted-foreground">Secure, modern, and designed around you.</p>
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white/90 backdrop-blur border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Application Requirements</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle2" className="text-success mt-0.5" size={16} />
              Valid Government ID (NRC/Passport)
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle2" className="text-success mt-0.5" size={16} />
              Proof of Address (utility bill or bank statement, last 3 months)
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle2" className="text-success mt-0.5" size={16} />
              Active Mobile Number & Email Address
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle2" className="text-success mt-0.5" size={16} />
              Minimum Age: 18 years
            </li>
            <li className="flex items-start gap-2">
              <Icon name="CheckCircle2" className="text-success mt-0.5" size={16} />
              Source of Funds Declaration
            </li>
          </ul>
          <div className="mt-4 text-xs text-muted-foreground">
            Note: Additional documentation may be requested to complete KYC verification.
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white/90 backdrop-blur border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Why Choose MelvinBank Zambia</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div className="flex items-start gap-2">
              <Icon name="Shield" size={16} className="text-success mt-0.5" />
              <span>Enterprise-grade security & fraud protection</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="Zap" size={16} className="text-accent mt-0.5" />
              <span>Fast transfers and modern digital banking</span>
            </div>
            <div className="flex items-start gap-2">
              <Icon name="PieChart" size={16} className="text-secondary mt-0.5" />
              <span>Budgeting tools and clear financial insights</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default function Register() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-border/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center ring-1 ring-white/10">
                <Icon name="Building2" size={20} color="white" />
              </div>
              <span className="text-xl font-semibold text-foreground tracking-tight">MelCredit Union Bank</span>
            </div>
            <div className="flex items-center gap-2">
              <a href="/login">
                <Button variant="ghost" iconName="LogIn">Sign In</Button>
              </a>
              <a href="/">
                <Button variant="outline" iconName="Home">Dashboard</Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="mb-8 rounded-2xl overflow-hidden relative shadow-md ring-1 ring-black/5">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent" />
            <img
              src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?q=80&w=1600&auto=format&fit=crop"
              alt="Bank branch"
              className="w-full h-40 object-cover"
              loading="lazy"
            />
          </div>
          <AccountOpeningForm />
        </div>
      </main>
    </div>
  );
}
