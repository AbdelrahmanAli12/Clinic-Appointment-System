const { validateJWT } = require('../Authentication/Services');
const { Result, ResultOperation, LoggedInUser } = require('../Common');
const rolePermissions = require('../Config/roles');

const checkRolePermission = (requiredPermissions) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        token = parts[1];
      }
    }

    if (token === '') return res.status(401).json({ message: `Access Denied: JWT not provided` });
    const authResult = await validateJWT(token);
    if (!authResult.isSuccess)
      return res.status(401).json({ message: `Access Denied: ${authResult.data}` });
    LoggedInUser.getInstance(authResult.data);
    let userRole = String(authResult.data.role).toLowerCase();
    const permissions = rolePermissions[userRole];
    if (permissions.some((permission) => requiredPermissions.includes(permission))) {
      return next();
    }

    const result = new Result({
      operation: ResultOperation.Unauthorized,
      message: 'Access denied',
    });
    return res.status(result.operation).json(result.getJsonData());
  };
};

module.exports = checkRolePermission;
