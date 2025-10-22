import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { gradients } from '../../styles/palette';

const UserRow = ({ user, onToggleStatus, onEditRoles }) => (
  <tr className="border-b border-gray-100 hover:bg-gray-50">
    <td className="px-4 py-3">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <Icon name="User" size={16} className="text-gray-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900 text-sm">{user.name}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex flex-wrap gap-1">
        {user.roles.map(role => (
          <span key={role} className={`px-2 py-1 rounded text-xs font-medium ${
            role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {role}
          </span>
        ))}
      </div>
    </td>
    <td className="px-4 py-3">
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      }`}>
        {user.status}
      </span>
    </td>
    <td className="px-4 py-3 text-xs text-gray-500">
      {user.lastLogin}
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => onEditRoles(user)}>
          <Icon name="Edit" size={14} />
        </Button>
        <Button 
          size="sm" 
          variant={user.status === 'active' ? 'destructive' : 'default'}
          onClick={() => onToggleStatus(user)}
        >
          <Icon name={user.status === 'active' ? 'UserMinus' : 'UserPlus'} size={14} />
        </Button>
      </div>
    </td>
  </tr>
);

const AdminUsers = () => {
  const [users] = useState([
    { id: 1, name: 'John Smith', email: 'john@melcredit.com', roles: ['customer'], status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Doe', email: 'jane@melcredit.com', roles: ['customer'], status: 'active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Admin User', email: 'admin@melcredit.com', roles: ['admin'], status: 'active', lastLogin: '2024-01-15' },
    { id: 4, name: 'Bob Wilson', email: 'bob@melcredit.com', roles: ['customer'], status: 'disabled', lastLogin: '2024-01-10' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (user) => {
    console.log('Toggle status for:', user.name);
    // Implementation would update user status
  };

  const handleEditRoles = (user) => {
    console.log('Edit roles for:', user.name);
    // Implementation would open role editing modal
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">User Management</h1>
            <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
          </div>
          <div className="flex gap-3">
            <a href="/admin">
              <Button variant="outline">
                <Icon name="ArrowLeft" size={16} className="mr-2" />
                Back to Admin
              </Button>
            </a>
            <Button>
              <Icon name="UserPlus" size={16} className="mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                { value: 'all', label: 'All Roles' },
                { value: 'customer', label: 'Customer' },
                { value: 'admin', label: 'Admin' },
              ]}
            />
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Users" size={16} />
              <span>{filteredUsers.length} users found</span>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roles
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <UserRow
                  key={user.id}
                  user={user}
                  onToggleStatus={handleToggleStatus}
                  onEditRoles={handleEditRoles}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;