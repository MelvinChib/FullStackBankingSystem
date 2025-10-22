import React from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Auth from '../../services/auth';
import { gradients } from '../../styles/palette';

const AdminCard = ({ icon, title, desc, href, color }) => (
  <a href={href} className="block">
    <div className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all">
      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${color} text-white flex items-center justify-center mb-3`}>
        <Icon name={icon} size={18} color="white" />
      </div>
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-gray-600 text-xs">{desc}</p>
    </div>
  </a>
);

const Admin = () => {
  const session = Auth.getSession();
  const roles = session?.user?.roles || [];
  const isAdmin = roles.includes('admin');

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Console</h1>
            <p className="text-sm text-gray-600">Manage users, settings, and audit logs</p>
          </div>
          <a href="/account-dashboard">
            <Button variant="outline">
              <Icon name="LayoutDashboard" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </a>
        </div>

        {!isAdmin ? (
          <div className="bg-white border border-red-200 text-red-700 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Icon name="ShieldAlert" size={18} />
              <p className="text-sm font-medium">Access denied. Admin role required.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AdminCard icon="Users" title="Manage Users" desc="Create, disable, and assign roles" href="/admin/users" color={gradients.indigoPurple} />
            <AdminCard icon="Settings" title="System Settings" desc="Configure application settings" href="/admin/settings" color={gradients.blueCyan} />
            <AdminCard icon="FileClock" title="Audit Logs" desc="Review recent administrative activity" href="/admin/logs" color={gradients.amberOrange} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
