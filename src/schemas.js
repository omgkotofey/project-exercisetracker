const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
}, { versionKey: false });

const TaskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  }, 
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: Date
}, { versionKey: false });

exports.User = mongoose.model('User', UserSchema);
exports.Task = mongoose.model('Task', TaskSchema);