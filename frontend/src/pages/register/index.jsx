import React, { useState } from 'react';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import ApiService from '../../services/api';

const AccountOpeningForm = () => {
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
  };

  const handleSelect = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    if (!form.firstName || !form.lastName) return 'Please enter your first and last name.';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) return 'Please enter a valid email address.';
    if (!form.phoneNumber || form.phoneNumber.length < 7) return 'Please enter a valid phone number.';
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    if (!form.addressLine1 || !form.city || !form.country) return 'Please complete your address (line 1, city, country).';
    if (!form.acceptTerms || !form.acceptPrivacy) return 'You must accept the Terms and Privacy Policy to proceed.';
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
      setSuccess('Your account application has been submitted successfully. Please check your email for next steps.');
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
            <div className="flex items-center space-x-2 p-3 bg-error/10 border border-error/20 rounded-lg text-error">
              <Icon name="AlertCircle" size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg text-success">
              <Icon name="CheckCircle2" size={16} />
              <span className="text-sm">{success}</span>
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
              <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} required placeholder="John" description="Enter your legal first name" />
              <Input label="Middle Name (optional)" name="middleName" value={form.middleName} onChange={handleChange} placeholder="Michael" />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} required placeholder="Doe" description="Enter your legal last name" />
              <Input label="Date of Birth" type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} description="Must be 18 years or older" />
              <Input label="National ID / Passport" name="nationalId" value={form.nationalId} onChange={handleChange} placeholder="123456/78/9" description="Enter your NRC or passport number" />
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
              <Input label="Email Address" type="email" name="email" value={form.email} onChange={handleChange} required placeholder="john.doe@example.com" description="We'll send your account details here" />
              <Input label="Mobile Number" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} required placeholder="+260 97 1234567" description="Include country code (e.g., +260)" />
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
              <Input label="Address Line 1" name="addressLine1" value={form.addressLine1} onChange={handleChange} required placeholder="123 Main Street" description="Street address or P.O. Box" />
              <Input label="Address Line 2 (optional)" name="addressLine2" value={form.addressLine2} onChange={handleChange} placeholder="Apt 4B" />
              <Input label="City" name="city" value={form.city} onChange={handleChange} required placeholder="Lusaka" />
              <Input label="Province / State" name="province" value={form.province} onChange={handleChange} placeholder="Lusaka Province" />
              <Input label="Postal Code" name="postalCode" value={form.postalCode} onChange={handleChange} placeholder="10101" />
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
              <Input label="Initial Deposit (optional)" type="number" name="initialDeposit" value={form.initialDeposit} onChange={handleChange} placeholder="1000" description="Minimum ZMW 100 recommended" />
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
              <Input label="Create Password" type="password" name="password" value={form.password} onChange={handleChange} required placeholder="••••••••" description="Min 8 chars: uppercase, lowercase, number, special char" />
              <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required placeholder="••••••••" description="Re-enter your password" />
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
