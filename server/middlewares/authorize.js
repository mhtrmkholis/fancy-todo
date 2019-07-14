const Todo = require('../models/todo')

module.exports = (req, res, next) => {
    Todo.findOne({_id: req.params.id})
        .then(todo => {
            if (todo.owner == req.decoded._id) next()
            else res.status(401).json(`${req.decoded.name} is not authorized`)
        })
        .catch(err => {
            res.status(500).json(err)
        })
}