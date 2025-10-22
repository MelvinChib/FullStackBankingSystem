import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import ThemeToggle from './ThemeToggle';
import Auth from '../../services/auth';
import api from '../../services/api';

const Header = ({ user, onLogout, isCollapsed = false, onToggleSidebar }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const currentUser = user || Auth.getUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isAuthed = Auth.isAuthenticated();

  const navigationItems = isAuthed ? [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Dashboard', path: '/account-dashboard', icon: 'LayoutDashboard', permission: 'VIEW_DASHBOARD' },
    { label: 'Accounts', path: '/account-details', icon: 'CreditCard', permission: 'VIEW_ACCOUNTS' },
    { label: 'Transfers', path: '/transfer-funds', icon: 'ArrowLeftRight', permission: 'TRANSFER_FUNDS' },
    { label: 'Payments', path: '/bill-pay', icon: 'Receipt', permission: 'BILL_PAY' },
    { label: 'Mobile Money', path: '/mobile-money', icon: 'Smartphone', permission: 'MOBILE_MONEY' },
    { label: 'Statements', path: '/statements', icon: 'FileText', permission: 'VIEW_STATEMENTS' },
    { label: 'Support', path: '/support', icon: 'HelpCircle', permission: 'VIEW_SUPPORT' },
    { label: 'Budget', path: '/budget-tracker', icon: 'PieChart', permission: 'VIEW_BUDGET' },
    { label: 'Admin', path: '/admin', icon: 'ShieldCheck', permission: 'MANAGE_SETTINGS', roles: ['admin'] },
    { label: 'Profile', path: '/profile', icon: 'User', permission: 'VIEW_PROFILE' },
    { label: 'Settings', path: '/settings', icon: 'Settings', permission: 'VIEW_SETTINGS' },
  ] : [
    { label: 'Home', path: '/', icon: 'Home' },
    { label: 'Personal Banking', path: '/#services', icon: 'User' },
    { label: 'Business Banking', path: '/#business', icon: 'Building2' },
    { label: 'Mobile Money', path: '/#mobile-money', icon: 'Smartphone' },
    { label: 'About Us', path: '/about', icon: 'Info' },
    { label: 'Contact', path: '/help', icon: 'Phone' },
  ];

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const handleUserMenuToggle = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = () => {
    setIsUserMenuOpen(false);
    try { api.logout?.(); } catch {}
    try { Auth.logout(); } catch {}
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-100 bg-card/80 backdrop-blur supports-[backdrop-filter]:backdrop-blur border-b border-border/60 shadow-sm">
        <div className="flex items-center justify-between h-16 px-6">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="lg:hidden"
              >
                <Icon name="Menu" size={20} />
              </Button>
            )}
            <a href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center ring-1 ring-white/10 shadow-sm group-hover:shadow-md transition-shadow">
                <Icon name="Building2" size={24} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight tracking-tight">MelCredit Union</span>
                <span className="text-xs text-gray-600 leading-tight">Bank</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigationItems
              ?.filter(item => {
                if (!isAuthed) return true;
                try {
                  const s = Auth.getSession();
                  const perms = s?.user?.permissions || [];
                  const roles = s?.user?.roles || [];
                  const permissionOk = !item?.permission || perms.includes(item.permission);
                  const roleOk = !item?.roles || item.roles.some(r => roles.includes(r));
                  return permissionOk && roleOk;
                } catch { return false; }
              })
              ?.map((item) => (
              <a
                key={item?.path}
                href={item?.path}
                className={`relative flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  isActivePath(item?.path)
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
                {isActivePath(item?.path) && (
                  <span className="absolute -bottom-1 left-2 right-2 h-0.5 bg-primary rounded-full" />
                )}
              </a>
            ))}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
              className="lg:hidden"
            >
              <Icon name="Menu" size={20} />
            </Button>

            {!isAuthed && (
              <div className="hidden md:flex items-center space-x-2">
                <a href="/login">
                  <Button variant="outline" className="rounded-full px-5">Log in</Button>
                </a>
                <a href="/register">
                  <Button className="rounded-full px-5">Open account</Button>
                </a>
              </div>
            )}

            <ThemeToggle />

            {/* User Profile Dropdown */}
            {isAuthed && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 px-3 py-2"
                >
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {currentUser?.name || 'User'}
                  </span>
                  <Icon name="ChevronDown" size={16} />
                </Button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && isAuthed && (
                  <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg z-200 animate-slide-down">
                    <div className="py-2">
                      <div className="px-4 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground">
                          {currentUser?.name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currentUser?.email || 'user@example.com'}
                        </p>
                      </div>
                      <a
                        href="/profile"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Icon name="User" size={16} />
                        <span>Profile</span>
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Icon name="Settings" size={16} />
                        <span>Settings</span>
                      </a>
                      <a
                        href="/help"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-foreground hover:bg-muted"
                      >
                        <Icon name="HelpCircle" size={16} />
                        <span>Help</span>
                      </a>
                      <div className="border-t border-border mt-2 pt-2">
                        <a
                          href="/logout"
                          className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-error hover:bg-muted"
                          onClick={(e) => { e.preventDefault(); handleLogout(); }}
                        >
                          <Icon name="LogOut" size={16} />
                          <span>Sign Out</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-slide-down">
            <nav className="px-6 py-4 space-y-2">
              {navigationItems?.map((item) => (
                <a
                  key={item?.path}
                  href={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.label}</span>
                </a>
              ))}
            </nav>
          </div>
        )}
      </header>
      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      {/* User Menu Backdrop */}
      {isUserMenuOpen && (
        <div
          className="fixed inset-0 z-150"
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;