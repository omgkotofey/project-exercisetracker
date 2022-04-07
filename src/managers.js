const { User, Task } = require('./schemas.js');

const Formatter = {
  formatTask: (task, user) => {
    return {
      "_id": task._id,
      "username": user.username,
      ...Formatter.formatTaskForLog(task)
    }
  },
  formatTaskForLog: (task) => {
    return {
      "description": task.description,
      "duration":  task.duration,
      "date": task.date.toDateString()
    }   
  }
}

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
    const task = await Task.create({
      user: user,
      description: description,
      duration: duration,
      date: date
    });

    return Formatter.formatTask(task, user);
  },
  findAllByParams: async (user, from = null, to = null, limit = null) => {
    let params = {
      user: user
    };

    if (from || to) {
      params.date = {};
      if (from) {
        params.date.$gte = Date.parse(from);
      }
  
      if (to) {
        params.date.$lt = Date.parse(to);
      }
    }
    
    const query = Task.find(params).select('-_id');
    if (limit) {
      query.limit(limit);
    }

    return await query.exec();
  }
};

const LogsManager = {
  findUserWithTaks: async (user_id, from = null, to = null, limit = null) => {
    const user = await UserManager.findById(user_id);
    const tasks = await TaskManager.findAllByParams(user, from, to, limit);

    let taskLog = [];
    for (task of tasks) {
      taskLog.push(Formatter.formatTaskForLog(task))
    }

    return {
      ...user.toObject(),
      count: tasks.length,
      log: taskLog
    }
  }
};


module.exports = {
  UserManager: UserManager,
  TaskManager: TaskManager,
  LogsManager: LogsManager
}