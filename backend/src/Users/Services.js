const { default: mongoose } = require('mongoose');
const { Result, ResultOperation, GlobalUserRoles } = require('../Common');
const { User } = require('./Schema');
async function createUser(userInfo) {
  try {
    const userCreation = await User.create({ ...userInfo });

    if (!userCreation.$errors)
      return new Result({
        operation: ResultOperation.Success,
        message: `${userInfo.name} created successfully!`,
      });

    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to create user!`,
    });
  } catch (error) {
    console.error('Error creating new user ', error);

    const result = new Result({
      operation: ResultOperation.Failure,
      message: `Failed to create new user ${error}`,
      data: error,
    });
    if (error.code === 11000 || error.code === 11001) {
      result.operation = ResultOperation.Conflict;
      result.message = 'Duplicate username or email found';
    }
    return result;
  }
}

async function getUsers({ findAll = false, useLogin = false, type = null, value = null }) {
  if (type && value && findAll) return new Result({ operation: ResultOperation.Conflict });

  let query = { [type]: value };

  if (findAll) {
    query = {};
  } else if (useLogin) {
    query = {
      $or: [{ username: value }, { email: value }],
    };
  } else {
    if (!['email', 'username', '_id', 'role'].includes(String(type).toLowerCase()))
      return new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Wrong filter provided',
      });

    if (!type || !value)
      return new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Paramters not provided',
      });
  }

  try {
    const allUsers = await User.find(query).lean().exec();

    if (allUsers) {
      if (allUsers.length > 0)
        return new Result({
          operation: ResultOperation.Success,
          data: allUsers,
        });
      return new Result({
        operation: ResultOperation.Not_Found,
        message: 'No Users were found with the given credentials',
        data: [],
      });
    } else {
      return new Result({ operation: ResultOperation.Failure });
    }
  } catch (error) {
    console.error('Error getting users', error);
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to get users, ${error.message}`,
      data: JSON.stringify(error),
    });
  }
}

async function getUserInfo(identifier) {
  const isValidObjectId = mongoose.Types.ObjectId.isValid(identifier);
  let query;

  if (isValidObjectId) {
    query = { _id: identifier };
  } else {
    query = { $or: [{ username: identifier }, { email: identifier }] };
  }

  try {
    const userInfoResult = await User.findOne(query, { password: 0 });
    if (!userInfoResult) {
      return new Result({
        operation: ResultOperation.Not_Found,
        message: 'User not found',
        data: error,
      });
    }
    return new Result({
      operation: ResultOperation.Success,
      message: 'User data retrieved',
      data: userInfoResult,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Server_Error,
      message: 'ServerError',
      data: error,
    });
  }
}

async function getTopHealthcareUsers() {
  try {
    const pipeline = [
      {
        $match: { role: GlobalUserRoles.HealthcareUser },
      },
      {
        $lookup: {
          from: 'appointments',
          localField: '_id',
          foreignField: 'healthcareUser',
          as: 'appointments',
        },
      },
      {
        $project: {
          name: 1,
          appointmentCount: { $size: '$appointments' },
        },
      },
      {
        $sort: { appointmentCount: -1 },
      },
      {
        $limit: 5,
      },
    ];
    const topUsers = await User.aggregate(pipeline).exec();

    return new Result({
      operation: ResultOperation.Success,
      message: ``,
      data: topUsers,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `API Failure: failed to get top users ${error.message}`,
      data: JSON.stringify(error),
    });
  }
}

async function updateUser({ id, updateBody, mongooseAction = '$set' }) {
  try {
    const updateResult = await User.updateOne(
      {
        _id: new mongoose.Types.ObjectId(id),
      },
      {
        [mongooseAction]: updateBody,
      },
      { runValidators: true },
    );

    if (updateResult.matchedCount === 0 || !updateResult.acknowledged)
      return new Result({
        operation: ResultOperation.Not_Found,
        message: `User not found`,
      });
    return new Result({
      operation: ResultOperation.Success,
      message: `User(s) field(s) updated`,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `API Failure: failed to delete user ${error.message}`,
      data: JSON.stringify(error),
    });
  }
}

async function deleteUser(identifier) {
  try {
    const deleteUserResp = await User.deleteOne({
      _id: identifier,
    });

    if (deleteUserResp.deletedCount > 0) {
      return new Result({
        operation: ResultOperation.Success,
        message: `User deleted successfully`,
      });
    }
    return new Result({
      operation: ResultOperation.Failure,
      message: ` Failure: failed to delete user `,
      data: JSON.stringify(deleteUserResp),
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `API Failure: failed to delete user ${error.message}`,
      data: JSON.stringify(error),
    });
  }
}
module.exports = {
  getUserInfo,
  getUsers,
  createUser,
  getTopHealthcareUsers,
  deleteUser,
  updateUser,
};
