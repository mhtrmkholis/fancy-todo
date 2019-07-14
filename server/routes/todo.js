const express = require('express');
const router = express.Router();
const TodoController = require('../controllers/todo-controller');
const authenticate = require('../middlewares/authentication');
const authorize = require('../middlewares/authorize');

router.use(authenticate);
router.post('/', TodoController.create);
router.get('/', TodoController.findAll);
router.put('/:id', authorize, TodoController.update);
router.patch('/:id', authorize, TodoController.update);
router.delete('/:id', authorize, TodoController.destroy);
module.exports = router