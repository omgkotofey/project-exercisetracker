const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const { UserManager, TaskManager } = require('./src/managers.js');


dotenv.config();
mongoose.connect(process.env['MONGO_URI'], { useNewUrlParser: true });

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true})); 

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users/:userId', (req, res) => { 
  const { userId } = req.params;
  
  return UserManager.findById(userId)
  .then(user => {
    if (!user) {
      res.status(404).send(`Error: User not found`);
    }
    res.status(200).send(user);
  })
});

app.post('/api/users', (req, res) => { 
  const { username } = req.body;
  
  return UserManager.createUser(username)
  .then(user => res.status(200).send(user))
  .catch(err => {
    console.error(err);
    return res.status(400).send(`Error: Something went wrong`)
  });
});

app.post('/api/users/:userId/exercises', (req, res) => { 
  const { userId } = req.params;
  const { description, duration, date } = req.body;
  
  return TaskManager.createTask(userId, description, duration, date)
  .then(task => res.status(200).send(task))
  .catch(err => {
    console.error(err);
    return res.status(400).send(`Error: Something went wrong`)
  });
});


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
