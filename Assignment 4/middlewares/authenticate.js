const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
 const token = req.cookies.token; 
//   const token = req.header("Authorization")
  console.log("this is my token"+token)
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  } catch (ex) {
    res.status(400).send('Invalid token.');
  }
};
