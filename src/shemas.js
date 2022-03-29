const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
}));

const Task = mongoose.model('Task', new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }, 
  user_id: {
    type: String,
    required: true
  },
  date: Date
}));

exports.User = User;
exports.Task = Task;