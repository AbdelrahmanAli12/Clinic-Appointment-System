const { ResultOperation, Result } = require('../Common');
const express = require('express');
const app = express();
const { getUsers } = require('../Users/Services');
const { isPasswordsIdentical, generateJWT } = require('./Services');

async function login(req, res) {
  const { identifier, password } = req.body;
  try {
    if (!identifier || !password) {
      const result = new Result({
        operation: ResultOperation.Bad_Request,
        message: 'Username, email, or password was not provided',
      });
      return res.status(result.operation).send(result.getJsonData());
    }
    const userResult = await getUsers({
      useLogin: true,
      value: identifier,
      type: 'username',
    });
    if (!userResult?.isSuccess)
      return res.status(userResult.operation).json(userResult.getJsonData());

    const userData = userResult.data[0];

    const passwordComparisonResult = await isPasswordsIdentical(password, userData.password);
    if (!passwordComparisonResult.isSuccess)
      return res
        .status(passwordComparisonResult.operation)
        .json(passwordComparisonResult.getJsonData());

    const jwtGenerationResult = generateJWT(userData.role, userData._id, userData.username, '10h');

    return res.status(jwtGenerationResult.operation).json(jwtGenerationResult.getJsonData());
  } catch (error) {
    console.error('Login error:', error);
    const result = new Result({
      operation: ResultOperation.Failure,
      message: `API Failure, ${error}`,
    });

    return res.status(result.operation).json(result.getJsonData());
  }
}
app.post('/login', login);

module.exports = app;
