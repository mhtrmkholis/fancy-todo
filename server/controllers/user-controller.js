const User = require('../models/user');
const bcrypt = require('../helpers/bcrypt');
const jwt = require('../helpers/jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const generatePassword = require('../helpers/generate-password');

class UserController {
  static create(req, res, next) {
    User.create(req.body)
      .then(user => {
        res.status(201).json(user)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    User.find()
      .then(user => {
        res.status(200).json(user)
      })
      .catch(next)
  }

  static signin(req, res, next) {
    const { email, password } = req.body
    User.findOne({ email })
      .then(user => {
        if (!user) throw { status: 404, message: 'Email / password wrong' }
        else if (!bcrypt.comparePassword(password, user.password)) {
          throw { status: 404, message: 'Email / password wrong' }
        }
        else {
          const myToken = jwt.generateJWT({
            _id: user._id,
            name: user.name,
            email: user.email,
          })
          res.status(200).json({token: myToken, name: user.name})
        }
      })
      .catch(next)
  }

  static googleSignin(req, res, next) {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
    let { name, email } = {}
    client.verifyIdToken({
      idToken: req.headers.id_token,
      audience: process.env.GOOGLE_CLIENT_ID
    })
    .then(ticket => {
      name = ticket.getPayload().name
      email = ticket.getPayload().email
      return User.findOne({ email })
    })
    .then(user => {
      if (user) return user
      else {
        let password = generatePassword()
        return User.create({ name, email, password })
      }
    })
    .then(user => {
      const myToken = jwt.generateJWT({
        _id: user._id,
        name: user.name,
        email: user.email,
      })
      res.status(200).json({token: myToken, name: user.name})
    })
    .catch(next)
  }
}

module.exports = UserController