import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BreadcrumbTrail = ({ customBreadcrumbs }) => {
  const location = useLocation();

  const routeMap = {
    '/account-dashboard': { label: 'Dashboard', icon: 'LayoutDashboard' },
    '/account-details': { label: 'Account Details', icon: 'CreditCard' },
    '/transfer-funds': { label: 'Transfer Funds', icon: 'ArrowLeftRight' },
    '/bill-pay': { label: 'Bill Pay', icon: 'Receipt' },
    '/budget-tracker': { label: 'Budget Tracker', icon: 'PieChart' },
    '/login': { label: 'Login', icon: 'LogIn' },
  };

  const generateBreadcrumbs = () => {
    if (customBreadcrumbs) {
      return customBreadcrumbs;
    }

    const pathSegments = location?.pathname?.split('/')?.filter(Boolean);
    const breadcrumbs = [{ label: 'Home', path: '/account-dashboard', icon: 'Home' }];

    let currentPath = '';
    pathSegments?.forEach((segment) => {
      currentPath += `/${segment}`;
      const route = routeMap?.[currentPath];
      if (route) {
        breadcrumbs?.push({
          label: route?.label,
          path: currentPath,
          icon: route?.icon,
        });
      }
    });

    // Remove duplicate home if current page is dashboard
    if (breadcrumbs?.length > 1 && breadcrumbs?.[1]?.path === '/account-dashboard') {
      breadcrumbs?.shift();
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs?.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbs?.map((crumb, index) => (
          <li key={crumb?.path || index} className="flex items-center space-x-2">
            {index > 0 && (
              <Icon name="ChevronRight" size={14} className="text-muted-foreground/60" />
            )}
            
            {index === breadcrumbs?.length - 1 ? (
              <span className="flex items-center space-x-1 text-foreground font-medium">
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </span>
            ) : (
              <a
                href={crumb?.path}
                className="flex items-center space-x-1 hover:text-foreground transition-colors duration-200"
              >
                <Icon name={crumb?.icon} size={14} />
                <span>{crumb?.label}</span>
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadcrumbTrail;