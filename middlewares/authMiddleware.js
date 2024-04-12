const jwt = require('jsonwebtoken');

const authenticateUser = async (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }
    // Verify the token
    const decodedToken = jwt.verify(token, 'vivek');

    req.userId = decodedToken.userId;
    req.userRole = decodedToken.role;

    next();
  } 
  catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authenticateUser;
