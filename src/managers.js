const { User, Task } = require('./schemas.js');

const UserManager = {
  createUser: (username) => User.create({ username: username }),
  findById: (id) => User.findById(id).exec(),
  findAll: () => User.find().exec()
};

const TaskManager = {
  createTask: (user_id, description, duration, date = null) => {
    return UserManager.findById(user_id)
      .then(user => {
        if (!user) {
          throw new Error(`User with id ${user_id} not found`);
        }
    
        return Task.create({
          user_id: user._id,
          description: description,
          duration: duration,
          date: date
        })
      })
  },
  findTasksForUser: (user) => User.find({ user_id: user._id }).exec()
};

const LogsManager = {
  findAllForUser: (user_id, from = null, to = null, limit = null) => new Promise((resolve, reject) => {
    UserManager.findById(user_id)
    .then((result) => {
      
    })
  })
};


exports.UserManager = UserManager;
exports.TaskManager = TaskManager;
exports.LogsManager = LogsManager;