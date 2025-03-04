const { createUser, getTopHealthcareUsers, deleteUser, updateUser } = require('./Services');
const express = require('express');
const app = express();
const { getUsers, getUserInfo } = require('./Services');
const { hashPassword } = require('../Authentication/Services');
const checkRolePermission = require('../middleware/roleAuthorization');
const { Result, ResultOperation, GlobalUserRoles, LoggedInUser } = require('../Common');
const { default: mongoose } = require('mongoose');
const { User, UpdateUserSchema } = require('./Schema');

const createNewUser = async (req, res) => {
  const userInfo = req.body;
  const userDoc = new User(userInfo);
  const validationError = userDoc.validateSync();

  if (validationError) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: validationError.message,
    });
    return res.status(result.operation).json(result.getJsonData());
  }

  if (
    !userInfo.hasOwnProperty('password') ||
    [null, undefined, ''].includes(userInfo['password'])
  ) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: 'Password invalid',
    });
    return res.status(result.operation).json(result.getJsonData());
  }

  const hashedPasswordResult = await hashPassword(userInfo['password']);
  if (!hashedPasswordResult.isSuccess) {
    return res.status(hashedPasswordResult.operation).json(hashedPasswordResult.getJsonData());
  }
  userInfo['password'] = hashedPasswordResult.data;
  const userCreation = await createUser(userInfo);

  return res.status(userCreation.operation).json(userCreation.getJsonData());
};

const getAllUsers = async (req, res) => {
  const allUsersResult = await getUsers({ findAll: true });

  return res.status(allUsersResult.operation).json(allUsersResult.getJsonData());
};

const userInfo = async (req, res) => {
  const loggedInUser = LoggedInUser.getInstance();
  const userRole = loggedInUser.role;
  let identifier = new mongoose.Types.ObjectId(loggedInUser.userId);
  if (
    (userRole.includes(GlobalUserRoles.Admin) || userRole.includes(GlobalUserRoles.Scheduler)) &&
    req.params.identifier
  ) {
    identifier = req.params.identifier;
  }

  const userInfoResult = await getUserInfo(identifier);

  return res.status(userInfoResult.operation).json(userInfoResult.getJsonData());
};

const userDahboard = async (req, res) => {
  const loggedInUser = LoggedInUser.getInstance();
  const userRole = loggedInUser.role;

  const response = {};

  if (userRole === GlobalUserRoles.Admin || userRole === GlobalUserRoles.Scheduler) {
    response['topUsers'] = await getTopHealthcareUsers();
  }
  const result = new Result({
    operation: ResultOperation.Success,
    data: response,
  });

  return res.status(result.operation).json(result.getJsonData());
};

const deleteUserController = async (req, res) => {
  const loggedInUser = LoggedInUser.getInstance();
  const userRole = loggedInUser.role;
  const roleCheck = await getUserInfo(req.params.identifier);
  if (
    userRole == GlobalUserRoles.Scheduler &&
    (roleCheck.data.role == GlobalUserRoles.Admin ||
      roleCheck.data.role == GlobalUserRoles.Scheduler)
  ) {
    const result = new Result({
      operation: ResultOperation.Unauthorized,
      message: 'Access denied',
    });
    return res.status(result.operation).json(result.getJsonData());
  }
  const deleteUserResp = await updateUser({
    id: req.params.identifier,
    updateBody: {
      active: false,
    },
  });
  return res.status(deleteUserResp.operation).json(deleteUserResp.getJsonData());
};

const updateUserController = async (req, res) => {
  try {
    const updateBody = req.body;
    const loggedInUser = LoggedInUser.getInstance();
    const userRole = loggedInUser.role;
    const roleCheck = await getUserInfo(updateBody._id);
    if (
      userRole == GlobalUserRoles.Scheduler &&
      (roleCheck.data.role == GlobalUserRoles.Admin ||
        roleCheck.data.role == GlobalUserRoles.Scheduler)
    ) {
      const result = new Result({
        operation: ResultOperation.Unauthorized,
        message: 'Access denied',
      });
      return res.status(result.operation).json(result.getJsonData());
    }
    if (!updateBody._id) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: 'User id not found',
      });
      return res.status(result.operation).json(result.getJsonData());
    }
    const { _id } = updateBody;
    delete updateBody._id;

    const updateUserDoc = new UpdateUserSchema(updateBody);
    const validationError = updateUserDoc.validateSync();

    if (validationError) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: validationError.message,
      });
      return res.status(result.operation).json(result.getJsonData());
    }

    const updateUserResult = await updateUser({ id: _id, updateBody: updateBody });
    return res.status(updateUserResult.operation).json(updateUserResult.getJsonData());
  } catch (error) {
    const result = new Result({
      operation: ResultOperation.Failure,
      message: 'Failed to update user :' + error.message ?? '',
      data: JSON.stringify(error),
    });
    return res.status(result.operation).json(result.getJsonData());
  }
};

const updateAddressController = async (req, res) => {
  const updateBody = req.body;
  const { id, address } = updateBody;
  if (!address || Object.entries(address).length === 0) {
    const result = new Result({
      operation: ResultOperation.Bad_Request,
      message: 'Address cannot be empty',
    });
    return res.status(result.operation).json(result.getJsonData());
  }

  const updateResult = await updateUser({
    id: id,
    updateBody: { address: address },
    mongooseAction: '$push',
  });
  return res.status(updateResult.operation).json(updateResult.getJsonData());
};

app.post('/', checkRolePermission(['admin:create', 'scheduler:create']), createNewUser);
app.put('/', checkRolePermission(['admin:update', 'scheduler:update']), updateUserController);
app.put(
  '/addAddress',
  checkRolePermission(['admin:update', 'scheduler:update']),
  updateAddressController,
);

app.get('/all', checkRolePermission(['admin:read', 'scheduler:create']), getAllUsers);
app.get(
  '/dashboard',
  checkRolePermission([
    'admin:read',
    'patient:read',
    'healthcareUser:read',
    'scheduler:read',
    'accountant:read',
  ]),
  userDahboard,
);
app.delete(
  '/:identifier',
  checkRolePermission(['admin:read', 'scheduler:read']),
  deleteUserController,
);
app.get(
  '/:identifier?',
  checkRolePermission([
    'admin:read',
    'patient:read',
    'healthcareUser:read',
    'scheduler:read',
    'accountant:read',
  ]),
  userInfo,
);

module.exports = app;
