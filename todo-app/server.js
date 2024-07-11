const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

let todos = require('./db.json').todos;

// Get all todos
app.get('/todos', (req, res) => {
  res.json(todos);
});

// Add a new todo
app.post('/todos', (req, res) => {
  const newTodo = {
    id: todos.length ? todos[todos.length - 1].id + 1 : 1,
    title: req.body.title,
    status: false
  };
  todos.push(newTodo);
  fs.writeFileSync('./db.json', JSON.stringify({ todos }, null, 2));
  res.status(201).json(newTodo);
});

// Update status of todos with even IDs
app.patch('/todos/update-even', (req, res) => {
  let updatedTodos = todos.map(todo => {
    if (todo.id % 2 === 0 && todo.status === false) {
      todo.status = true;
    }
    return todo;
  });
  todos = updatedTodos;
  fs.writeFileSync('./db.json', JSON.stringify({ todos }, null, 2));
  res.json(todos);
});

// Delete todos with status true
app.delete('/todos/delete-true', (req, res) => {
  todos = todos.filter(todo => todo.status !== true);
  fs.writeFileSync('./db.json', JSON.stringify({ todos }, null, 2));
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
