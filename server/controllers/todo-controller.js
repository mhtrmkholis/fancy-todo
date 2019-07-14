const Todo = require('../models/todo');
const ObjectId = require('objectid');
const nodemailer = require('nodemailer');

class TodoController {
  static create(req, res, next) {
    const { name, description, status, due_date } = req.body
    Todo
      .create({ name, description, status, due_date, owner: req.decoded._id })
      .then(todo => {
        const month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const email = `
                    <h1> Hi ${req.decoded.name}! </h1>
                    <h3>This message is from Fancy Todo! We are to inform that you have added a new todo list with the following description:</h3>
                    <h4> Title: </h4> 
                    <p>${name}</p>
                    <h4> Description: </h4>
                    <p> ${description}</p>
                    <h4> Due Date: </h4>
                    <p>${new Date(due_date).getDate()} ${month[new Date(due_date).getMonth()]} ${new Date(due_date).getFullYear()}</p>
                    <h3> Thanks for using Evertodo! Have a great day :)<h3>
                    <h3 style="font-style: italic">"The most effective way to do it, is to do it"<h3>
                    <h3>- Amelia Earhart<h3>
                    `
        let transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: 'fancytodo23@gmail.com',
            pass: '0227200351'
          },
          tls: { rejectUnauthorized: false }
        });

        let mailOptions = {
          from: '"FancyTodo" <fancytodo@gmail.com>',
          to: `${req.decoded.email}`,
          subject: "You added a new todo!",
          text: 'Hello world!',
          html: email
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) return console.log(error)
        })
        res.status(201).json(todo)
      })
      .catch(next)
  }

  static findAll(req, res, next) {
    Todo.find({ owner: ObjectId(req.decoded._id) })
      .populate('owner')
      .then(todos => res.status(200).json(todos))
      .catch(next)
  }

  static search(req, res, next) {
    const regex = new RegExp(req.query.search, 'i')
    Todo.find({ owner: req.headers.id })
      .populate('owner', 'email')
      .then((dataFound) => {
        if (req.query.search) {
          let filtered = dataFound.data.filter(todos => {
            return todos.name.match(regex)
          })
          res.status(200).json(filtered)
        } else {
          res.status(200).json(dataFound)
        }
      })
      .catch(next)
  }

  static destroy(req, res, next) {
    Todo.findByIdAndDelete(req.params.id)
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(next)
  }

  static update(req, res, next) {
    Todo.findByIdAndUpdate(req.params.id, req.body)
      .then(todo => {
        res.status(200).json(todo)
      })
      .catch(next)
  }
}

module.exports = TodoController