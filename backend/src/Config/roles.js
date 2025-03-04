const rolePermissions = {
  admin: ['admin:read', 'admin:create', 'admin:update', 'admin:delete'],
  scheduler: ['scheduler:read', 'scheduler:create', 'scheduler:update', 'scheduler:delete'],
  healthcareuser: ['healthcareUser:read', 'healthcareUser:update'],
  accountant: ['accountant:read'],
  patient: ['patient:read', 'patient:update', 'patient:delete'],
};

module.exports = rolePermissions;
