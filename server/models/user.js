const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const { Schema } = mongoose;
const bcrypt = require('../helpers/bcrypt');

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name can not be blank']
  },
  email: {
    type: String,
    validate: [
      {
        validator: (email) => {
          return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email)
        }, 
        message: 'Invalid email format'
      },
      {
        validator: (email) => {
          return new Promise ((resolve, reject) => {
            User.findOne({ email: email })
            .then(duplicate => {
              !duplicate ? resolve(true) : resolve(false)
            })
            .catch(err => reject(err))
          })
        },
        message: 'Email already registered by someone else'
      } 
    ],
    // unique: [true, 'Email already registered by someone else']
  },
  password: {
    type: String,
    required: [true, 'Password can not be blank'],
    minlength: [6, 'Password at least 6 characters']
  }
}, { timestamps: true, versionKey: false });

userSchema.pre('save', function(next, done) {
  this.password = bcrypt.hashPassword(this.password)
  next()
})

const User = mongoose.model('User', userSchema)

module.exports = User