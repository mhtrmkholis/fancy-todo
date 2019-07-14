const jwt = require('jsonwebtoken');

module.exports = {
  generateJWT(userPayload) {
    return jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1d' })
  },
  
  verifyJWT(token) {
    return jwt.verify(token, process.env.JWT_SECRET)
  }
}