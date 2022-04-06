const { User, Task } = require('./schemas.js');

const UserManager = {
  createUser: async (username) => await User.create({ username: username }),
  findById: async (id) => {
    const user = await User.findById(id).exec();
    if (!user) {
      throw new Error(`User with id ${user_id} was not found`);
    }
    return user;
  },
  findAll: async () => await User.find().exec()
};

const TaskManager = {
  createTask: async (user_id, description, duration, date = null) => {
    if (!date) {
      date = new Date();
    }
    
    const user = await UserManager.findById(user_id);
    
    return await Task.create({
      user_id: user._id,
      description: description,
      duration: duration,
      date: date
    });;
  },
  findAllByParams: async (user, from = null, to = null, limit = null) => {
    return await Task.find({
      user_id: user._id
    })
    .select('-_id')
    .exec()
  }
};

const LogsManager = {
  findUserWithTaks: async (user_id, from = null, to = null, limit = null) => {
    const user = await UserManager.findById(user_id);
    const tasks = await TaskManager.findAllByParams(user, from, to, limit);

    return {
      ...user.toObject(),
      count: tasks.length,
      log: tasks
    }
  }
};


module.exports = {
  UserManager: UserManager,
  TaskManager: TaskManager,
  LogsManager: LogsManager
}