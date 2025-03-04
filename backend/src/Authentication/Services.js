const { Result, ResultOperation } = require('../Common');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

async function isPasswordsIdentical(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    // isMathch returns true or false only
    if (isMatch) {
      return new Result({
        operation: ResultOperation.Success,
        message: `Passwords match`,
      });
    }

    if (!isMatch) {
      return new Result({
        operation: ResultOperation.Unauthorized,
        message: `Password, username or email are incorrect`,
      });
    }
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to compare passwords`,
      data: error,
    });
  }
}

async function hashPassword(password) {
  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    if (!hash)
      return new Result({
        operation: ResultOperation.Failure,
        message: `Failed to hash password`,
      });

    return new Result({
      operation: ResultOperation.Success,
      message: `Password hashed successfully`,
      data: hash,
    });
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      message: 'Failed to hash password',
      data: error,
    });
  }
}

function generateJWT(role, userId, username, expiration = '12h') {
  try {
    if (!role || !userId || !username)
      return new Result({
        operation: ResultOperation.Bad_Request,
        message: `Role, userId, and username should be provided`,
        data: err,
      });

    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let payload = {
      time: new Date().getTime(),
      userId: userId,
      role: role,
      username: username,
    };

    let options = {
      expiresIn: expiration,
    };

    const token = jwt.sign(payload, jwtSecretKey, options);

    return new Result({ operation: ResultOperation.Success, data: token });
  } catch (error) {
    console.error('Error signing JWT', error);
    return new Result({
      operation: ResultOperation.Failure,
      message: `Failed to sign JWT`,
      data: err,
    });
  }
}

async function validateJWT(receivedToken) {
  try {
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    const decoded = await jwt.verify(receivedToken, jwtSecretKey);

    if (decoded) {
      return new Result({ operation: ResultOperation.Success, data: decoded });
    } else {
      return new Result({
        operation: ResultOperation.Failure,
        message: `Failed to verify JWT`,
      });
    }
  } catch (error) {
    return new Result({
      operation: ResultOperation.Failure,
      data: error,
    });
  }
}

module.exports = {
  isPasswordsIdentical,
  hashPassword,
  generateJWT,
  validateJWT,
};
