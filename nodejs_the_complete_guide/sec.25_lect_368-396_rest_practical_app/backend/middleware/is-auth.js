const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(!authHeader) {
    const error = new Error('Unauthorised user');
    error.statusCode = 401;
    error.errors = [{message: 'Token not found'}];
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'secret');
  } catch (e) {
    e.statusCode = 500;
    throw e;
  }
  if(!decodedToken) {
    const error = new Error('Unauthorised user');
    error.statusCode = 401;
    error.errors = [{message: 'Invalid token'}];
    throw error;
  }
  req.userId = decodedToken.userId;
  next();
}
