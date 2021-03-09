const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  const user = users.find((c) => c.username === username);

  if(user){
    request.user = user;
    next();
  } else {
    return response.status(404).json({error: 'User not found!'});
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;

  const userAlreadyExists = users.find(x => x.username === username);

  if(userAlreadyExists){
    return response.status(400).json({error: 'User already exists!'});
  }

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(user);

  return response.status(201).json(user);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  return response.status(200).json(user.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;

  const task = {
    id: uuidv4(),
    title,  
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  user.todos.push(task);

  return response.status(201).json(task);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const task = user.todos.find((c) => c.id === id);

  if(!task){
    return response.status(404).json({error: 'Todos not found!'})
  }

  task.title = title;
  task.deadline = new Date(deadline);

  return response.status(200).json(task);
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const task = user.todos.find((c) => c.id === id);

  if(!task){
    return response.status(404).json({error: 'Todos not found!'});
  }

  task.done = true;

  return response.status(200).json(task);
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {user} = request;
  const {id} = request.params;

  const todos = user.todos;
  const todosIndex = todos.indexOf(todos.find((c) => c.id === id))
  if(todosIndex < 0){
    return response.status(404).json({error: 'Todos not found!'});
  }
  todos.splice(todosIndex, 1);

  return response.status(204).send();
});

module.exports = app;