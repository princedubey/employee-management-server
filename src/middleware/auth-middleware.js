const jwt = require('jsonwebtoken');
const usersServiceProvider = require('../services/users-service-provider');

exports.validateAccessToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    if (!accessToken) {
      return res.status(401).json({
        message: 'Invalid Access Token!',
        error_code: 'INVALID_ACCESS_TOKEN'
      });
    }

    jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          message: 'Invalid Access Token!',
          error_code: 'INVALID_ACCESS_TOKEN'
        });
      }

      const userId = decoded.id;

      const user = await usersServiceProvider.getUserById(userId);

      if (!user || accessToken !== user.access_token) {
        return res.status(401).json({
          message: 'Invalid Access Token!',
          error_code: 'INVALID_ACCESS_TOKEN'
        });
      }

      req.user = user;
      next();
    });
  } catch (error) {
    next(error);
  }
};
