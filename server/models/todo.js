const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const { Schema } = mongoose;

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name can not be blank'],
    maxlength: [50, 'Max name length is 50 characters']
  },
  description: {
    type: String,
    required: [true, 'Description can not be blank'],
    maxlength: [250, 'Max desc length is 250 characters']
  },
  status: {
    type: Boolean,
    default: false
  },
  due_date:{
    type: Date,
    validate: [
        {
            validator: function (value) {
                if (value <= new Date()){
                    return false
                } else {
                    return true
                }
            },
            message: 'Minimum due date for todo is tommorrow! Please make sure you input the right date!'            
        }
    ]
},
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true, versionKey: false });

const Todo = mongoose.model('Todo', todoSchema);

module.exports = Todo

