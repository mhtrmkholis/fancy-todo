const bcrypt = require('bcryptjs');

module.exports = {
  hashPassword(password) {
    return bcrypt.hashSync(password)
  },

  comparePassword(password, passwordDB) {
    return bcrypt.compareSync(password, passwordDB)
  }
}