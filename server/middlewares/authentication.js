const jwt = require('../helpers/jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    req.decoded = jwt.verifyJWT(req.headers.token, process.env.JWT_SECRET)
    next()
  }
  catch (err) {
    res.status(500).json(err)
  }
}