const { User, Task } = require('./managers.js');


const UserManager = {
  createUser: (username) => User.create({username: username}),
  findUser: (id) => User.findById(id),
  findAll: () => User.find().exec()
};

const TaskManager = {
  createTask: (user, description, duration, date = null) => Task.create({
    user_id: user._id,
    description: description,
    duration: duration, 
    date: date
  }),
  findTasksForUser: (user) => User.find({user_id: user._id}).exec()
};

const LogsManager = {
  findAllForUser: (user, from=null, to=null, limit=null) => null;
};

exports.UserManager = UserManager;
exports.TaskManager = TaskManager;
exports.LogsManager = LogsManager;