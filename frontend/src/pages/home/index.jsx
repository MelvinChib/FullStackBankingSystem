import React from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Auth from '../../services/auth';
import QuickActionSearch from './components/QuickActionSearch';
import { gradients } from '../../styles/palette';

const Home = () => {
  return (
    <div className="bg-background min-h-screen">
      <Header />

      {/* Hero Section - refreshed with more color accents */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 text-foreground">
        <div className="absolute inset-0"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50/80 text-blue-800 text-sm font-medium mb-6 shadow-sm">
                <Icon name="Shield" size={16} className="mr-2" />
                MelCredit Union Bank
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">
                How can we help you today?
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mb-8">
                Everyday banking for personal and business. Simple, secure, and convenient with MelCredit Union Bank.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-4">
                {Auth.isAuthenticated() ? (
                  <>
                    <a href="/account-dashboard">
                      <Button size="xl" className="h-14 px-8 font-semibold hover:shadow-lg hover:ring-2 hover:ring-primary/30 transition-shadow">
                        <Icon name="LayoutDashboard" size={20} className="mr-3" />
                        Go to Dashboard
                      </Button>
                    </a>
                    <a href="/transfer-funds">
                      <Button variant="outline" size="xl" className="h-14 px-8 font-semibold hover:shadow-lg hover:ring-2 hover:ring-primary/20 transition-shadow">
                        <Icon name="ArrowLeftRight" size={20} className="mr-3" />
                        Make a Transfer
                      </Button>
                    </a>
                  </>
                ) : (
                  <>
                    <a href="/register">
                      <Button size="xl" className="h-14 px-8 font-semibold hover:shadow-lg hover:ring-2 hover:ring-primary/30 transition-shadow">
                        <Icon name="UserPlus" size={20} className="mr-3" />
                        Open an account
                      </Button>
                    </a>
                    <a href="/login">
                      <Button variant="outline" size="xl" className="h-14 px-8 font-semibold hover:shadow-lg hover:ring-2 hover:ring-primary/20 transition-shadow">
                        <Icon name="LogIn" size={20} className="mr-3" />
                        Log in
                      </Button>
                    </a>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                <a className="hover:text-foreground flex items-center" href="/help?topic=branches">
                  <Icon name="MapPin" size={16} className="mr-2" /> Find a branch
                </a>
                <a className="hover:text-foreground flex items-center" href="/help">
                  <Icon name="Phone" size={16} className="mr-2" /> Contact us
                </a>
                <a className="hover:text-foreground flex items-center" href="/help?topic=appointments">
                  <Icon name="Calendar" size={16} className="mr-2" /> Schedule an appointment
                </a>
              </div>

              <QuickActionSearch />

              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-blue-100 mt-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Globe" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Global Network</p>
                    <p className="text-xs opacity-80">Access worldwide</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Shield" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Secure Banking</p>
                    <p className="text-xs opacity-80">Protected 24/7</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Smartphone" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Mobile Banking</p>
                    <p className="text-xs opacity-80">Bank on the go</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="Wallet" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Wallet & MoMo</p>
                    <p className="text-xs opacity-80">Instant transfers</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="CreditCard" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Cards</p>
                    <p className="text-xs opacity-80">Debit & credit</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Icon name="TrendingUp" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Invest & Save</p>
                    <p className="text-xs opacity-80">Grow wealth</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative bg-white/90 backdrop-blur rounded-2xl p-8 shadow-xl ring-1 ring-black/5">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="Building2" size={32} color="white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Quick Access</h3>
                  <p className="text-gray-600">Manage your finances with ease</p>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <a href={Auth.isAuthenticated() ? "/account-dashboard" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="UserPlus" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Open an account</p>
                        <p className="text-gray-600 text-xs">Get started online</p>
                      </div>
                    </a>
                    
                    <a href={Auth.isAuthenticated() ? "/transfer-funds" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="ArrowLeftRight" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Transfer money</p>
                        <p className="text-gray-600 text-xs">Send money</p>
                      </div>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a href={Auth.isAuthenticated() ? "/bill-pay" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="Receipt" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Pay a bill</p>
                        <p className="text-gray-600 text-xs">Make a payment</p>
                      </div>
                    </a>
                    
                    <a href={Auth.isAuthenticated() ? "/mobile-money" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="Smartphone" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Mobile Money</p>
                        <p className="text-gray-600 text-xs">MTN • Airtel • Zamtel</p>
                      </div>
                    </a>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <a href={Auth.isAuthenticated() ? "/statements" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="FileText" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Statements</p>
                        <p className="text-gray-600 text-xs">Export PDF/CSV</p>
                      </div>
                    </a>
                    
                    <a href={Auth.isAuthenticated() ? "/budget-tracker" : "/login"} className="block">
                      <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer">
                        <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center mb-3">
                          <Icon name="PieChart" size={20} color="white" />
                        </div>
                        <p className="font-semibold text-gray-900 text-sm">Budget</p>
                        <p className="text-gray-600 text-xs">Track spending</p>
                      </div>
                    </a>
                  </div>
                  
                      <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 text-blue-900 border border-blue-100/60 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs">Security reminder</p>
                        <p className="font-semibold">We will never ask for your password or 2FA code</p>
                      </div>
                      <Icon name="Shield" size={24} className="text-blue-300" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="pointer-events-none absolute top-0 right-0 w-1/3 h-full opacity-20">
          <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-teal-400/20 blur-xl rounded-full"></div>
          <div className="absolute top-40 right-40 w-24 h-24 bg-gradient-to-br from-teal-400/20 to-blue-400/20 blur-lg rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-teal-400/10 blur-2xl rounded-full"></div>
          {/* Floating icons */}
          <div className="absolute left-10 top-16 opacity-20 animate-bounce">
            <Icon name="Sparkles" size={28} className="text-blue-700" />
          </div>
          <div className="absolute left-1/3 top-1/2 opacity-10 animate-pulse">
            <Icon name="Shield" size={32} className="text-teal-700" />
          </div>
        </div>
      </section>

      {/* Banking Services */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Banking Services for Everyone</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From everyday banking to business solutions, we offer comprehensive financial services 
              designed to meet the needs of individuals and businesses across Zambia.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { 
                title: 'Personal Banking', 
                desc: 'Current accounts, savings, loans, and credit cards tailored for your lifestyle.', 
                icon: 'User', 
                link: Auth.isAuthenticated() ? '/account-dashboard' : '/login',
                color: gradients.blueIndigo
              },
              { 
                title: 'Business Banking', 
                desc: 'Corporate accounts, trade finance, and business loans to grow your enterprise.', 
                icon: 'Building2', 
                link: Auth.isAuthenticated() ? '/account-dashboard' : '/login',
                color: gradients.indigoPurple
              },
              { 
                title: 'Digital Banking', 
                desc: 'Online banking, mobile app, and digital wallet services available 24/7.', 
                icon: 'Smartphone', 
                link: '/mobile-money',
                color: gradients.tealEmerald
              },
              { 
                title: 'Investment Services', 
                desc: 'Wealth management, fixed deposits, and investment advisory services.', 
                icon: 'TrendingUp', 
                link: Auth.isAuthenticated() ? '/account-dashboard' : '/login',
                color: gradients.amberOrange
              },
            ].map((service) => (
              <div key={service.title} className="group">
                <a href={service.link} className="block">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2 border border-gray-100">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 ring-1 ring-black/5 bg-gradient-to-br ${service.color} text-white`}>
                      <Icon name={service.icon} size={22} color="white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
                    <div className="mt-4 flex items-center text-blue-700 font-medium text-sm">
                      <span>Learn more</span>
                      <Icon name="ArrowRight" size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                <Icon name="Star" size={16} className="mr-2" />
                Featured Products
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">360° Current Account</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our flagship current account with comprehensive banking services, 
                competitive rates, and exclusive benefits for MelCredit Union customers.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">No minimum balance</h4>
                    <p className="text-gray-600 text-sm">Start banking without maintaining minimum balance requirements</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Free mobile banking</h4>
                    <p className="text-gray-600 text-sm">Access your account anywhere with our mobile banking app</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon name="Check" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Global network access</h4>
                    <p className="text-gray-600 text-sm">Use your card and access services in over 60 countries</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <a href="/register">
                  <Button size="lg" className="bg-blue-900 hover:bg-blue-800">
                    <Icon name="CreditCard" size={18} className="mr-2" />
                    Open Account Now
                  </Button>
                </a>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl p-8 text-white shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-blue-200 text-sm">Current Account</p>
                    <p className="text-2xl font-bold">360° Account</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon name="CreditCard" size={24} color="white" />
                  </div>
                </div>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-sm">Monthly Maintenance</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-sm">Mobile Banking</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white/10 rounded-lg">
                    <span className="text-sm">Debit Card</span>
                    <span className="font-semibold">FREE</span>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-blue-200 text-xs mb-2">Interest Rate</p>
                  <p className="text-3xl font-bold">2.5% p.a.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Offers */}
      <section className="py-16 bg-gray-50 text-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured</h2>
            <p className="text-lg text-gray-600">Explore tools and offers to help you do more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <Icon name="CreditCard" size={20} className="text-blue-700" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Credit cards</h3>
              <p className="text-sm text-muted-foreground mb-4">Find a card that fits your lifestyle.</p>
              <a href="/login" className="text-sm font-medium text-blue-700 hover:underline flex items-center">
                Explore options <Icon name="ArrowRight" size={16} className="ml-1" />
              </a>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Icon name="Home" size={20} className="text-green-700" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Home loans</h3>
              <p className="text-sm text-muted-foreground mb-4">See rates and start a mortgage application.</p>
              <a href="/login" className="text-sm font-medium text-blue-700 hover:underline flex items-center">
                Get started <Icon name="ArrowRight" size={16} className="ml-1" />
              </a>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-4">
                <Icon name="Sparkles" size={20} className="text-amber-700" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Financial education</h3>
              <p className="text-sm text-muted-foreground mb-4">Tips and tools to build your financial confidence.</p>
              <a href="/help" className="text-sm font-medium text-blue-700 hover:underline flex items-center">
                Learn more <Icon name="ArrowRight" size={16} className="ml-1" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Financial insights */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Financial insights</h2>
            <p className="text-lg text-gray-600">Build confidence with tips and tools from MelCredit University.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              title: 'How to create a budget that works', icon: 'PieChart', href: '/help'
            },{
              title: 'Understanding credit scores', icon: 'Gauge', href: '/help'
            },{
              title: 'Saving for your first home', icon: 'Home', href: '/help'
            }].map((it, idx) => (
              <a key={idx} href={it.href} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <Icon name={it.icon} size={18} className="text-blue-700" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{it.title}</h3>
                <div className="mt-2 text-sm text-blue-700 font-medium flex items-center">Read more <Icon name='ArrowRight' size={14} className='ml-1' /></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact & Support */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">We're Here to Help</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our dedicated customer service team is available to assist you with all your banking needs. 
                Get support through multiple channels at your convenience.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon name="Phone" size={24} className="text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Phone Banking</h3>
                  <p className="text-gray-600 mb-4">Speak to our customer service representatives</p>
                  <p className="font-semibold text-blue-600">+260 211 229 933</p>
                  <p className="text-sm text-gray-500">Available 24/7</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon name="MapPin" size={24} className="text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Branch Locations</h3>
                  <p className="text-gray-600 mb-4">Visit us at our branches across Zambia</p>
                  <p className="font-semibold text-blue-600">Find Branches</p>
                  <p className="text-sm text-gray-500">Lusaka, Ndola, Kitwe & more</p>
                </div>
              </div>
            </div>
            
            <div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100">
                <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                  <Icon name="MessageSquare" size={32} className="text-blue-700" />
                </div>
                <h3 className="text-xl font-bold mb-4">Live Chat Support</h3>
                <p className="text-gray-600 mb-6">
                  Get instant help from our support team through our website chat feature.
                </p>
                <a href="/help">
                  <Button className="w-full">
                    <Icon name="MessageCircle" size={18} className="mr-2" />
                    Start Chat
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-50 text-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Experience Better Banking?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust MelCredit Union Bank
            for their financial needs. Open your account today and start banking with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register">
                  <Button size="xl" className="h-14 px-8 font-semibold">
                <Icon name="UserPlus" size={20} className="mr-3" />
                Open Account Now
              </Button>
            </a>
            <a href="/login">
              <Button variant="outline" size="xl" className="h-14 px-8 font-semibold">
                <Icon name="LogIn" size={20} className="mr-3" />
                Access Online Banking
              </Button>
            </a>
          </div>
          <div className="mt-8 flex items-center justify-center gap-8 text-muted-foreground text-sm">
            <div className="flex items-center gap-2">
              <Icon name="Shield" size={16} />
              <span>Bank-grade Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Lock" size={16} />
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Award" size={16} />
              <span>Award Winning</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
