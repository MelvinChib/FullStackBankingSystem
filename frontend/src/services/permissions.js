// Role-to-permission mapping and helpers

export const rolePermissions = {
  customer: [
    'VIEW_DASHBOARD',
    'VIEW_ACCOUNTS',
    'TRANSFER_FUNDS',
    'BILL_PAY',
    'MOBILE_MONEY',
    'MOBILE_DEPOSIT',
    'VIEW_BUDGET',
    'VIEW_STATEMENTS',
    'VIEW_PROFILE',
    'VIEW_SETTINGS',
    'VIEW_SUPPORT'
  ],
  admin: [
    // Admins get everything customers have...
    'VIEW_DASHBOARD',
    'VIEW_ACCOUNTS',
    'TRANSFER_FUNDS',
    'BILL_PAY',
    'MOBILE_MONEY',
    'MOBILE_DEPOSIT',
    'VIEW_BUDGET',
    'VIEW_STATEMENTS',
    'VIEW_PROFILE',
    'VIEW_SETTINGS',
    'VIEW_SUPPORT',
    // ...plus admin capabilities
    'MANAGE_USERS',
    'VIEW_ALL_ACCOUNTS',
    'MANAGE_SETTINGS'
  ]
};

export function permissionsForRoles(roles = []) {
  const set = new Set();
  roles.forEach(r => {
    (rolePermissions[r] || []).forEach(p => set.add(p));
  });
  return Array.from(set);
}

// Simple heuristic to assign demo roles from email
export function defaultRolesForEmail(email = '') {
  const e = String(email).toLowerCase();
  if (e.startsWith('admin@') || e.includes('+admin')) return ['admin'];
  return ['customer'];
}
