const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const { UserManager, TaskManager, LogsManager } = require('./src/managers.js');
const { Task, User } = require('./src/schemas.js');
const { errorHandler, APIError } = require('./src/errors.js');

dotenv.config();

mongoose
  .connect(process.env['MONGO_URI'], {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("Successfully connected to MongoDB."))
  .catch(err => console.error("Connection error", err));

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', async (req, res, next) => {   
  try {
    const users = await UserManager.findAll();
    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId', async (req, res, next) => { 
  const { userId } = req.params;

  try {
    const user = await UserManager.findById(userId);
    res.status(200).send(user);
  } catch (error) {
    next(new APIError(404, `Error: User not found`));
  }
});

app.post('/api/users', async (req, res, next) => { 
  const { username } = req.body;

  try {
    const user = await UserManager.createUser(username);
    res.status(200).send(user);
  } catch (error) {
    next(error);
  }
});

app.get('/api/users/:userId/logs', async (req, res, next) => { 
  const { userId } = req.params;
  const { limit, from, to } = req.query;

  try {
    const data = await LogsManager.findUserWithTaks(
      userId, 
      from,
      to,
      limit
    );
    res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

app.post('/api/users/:userId/exercises', async (req, res, next) => { 
  const { userId } = req.params;
  const { description, duration, date } = req.body;

  try {
    const task = await TaskManager.createTask(userId, description, duration, date);
    res.status(200).send(task);
  } catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
