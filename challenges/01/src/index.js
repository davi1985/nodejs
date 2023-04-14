const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

/**
 * User:
 * id: uuid
 * name: string
 * username: string
 * todos: []
 * 
 * Todo: 
 * id: 'uuid', // precisa ser um uuid
 * title: 'Nome da tarefa',
 * done: false, 
 * deadline: '2021-02-27T00:00:00.000Z',
 * created_at: '2021-02-22T00:00:00.000Z'
}
 */

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userIndexPosition = users.findIndex(
    (user) => user.username === username
  );

  if (userIndexPosition === -1) {
    return response.status(404).json({ error: "User not found" });
  }

  request.user = getUser(userIndexPosition);

  return next();
}

function checkExistsTodo(request, response, next) {
  const { user } = request;
  const { id } = request.params;

  const todoIndexPosition = user.todos.findIndex((todo) => todo.id === id);

  if (todoIndexPosition === -1) {
    return response.status(404).json({ error: "Todo not found!" });
  }

  request.todoIndex = todoIndexPosition;

  return next();
}

function getUser(userIndexPosition) {
  return users[userIndexPosition];
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const userAlreadyExists = users.some((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: "User already exists" });
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    username,
    todos: [],
  };

  users.push(user);

  return response.status(201).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: crypto.randomUUID(),
    title,
    done: false,
    deadline,
    created_at: new Date(),
  };

  user.todos.push(todo);

  return response.status(201).json(todo);
});

app.put(
  "/todos/:id",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    const { user, todoIndex } = request;
    const { title, deadline } = request.body;

    user.todos[todoIndex] = {
      ...user.todos[todoIndex],
      title,
      deadline,
    };

    return response.status(200).json(user.todos[todoIndex]);
  }
);

app.patch(
  "/todos/:id/done",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    const { user, todoIndex } = request;

    user.todos[todoIndex] = {
      ...user.todos[todoIndex],
      done: true,
    };

    return response.status(200).json(user.todos[todoIndex]);
  }
);

app.delete(
  "/todos/:id",
  checksExistsUserAccount,
  checkExistsTodo,
  (request, response) => {
    const { id } = request.params;
    const { user } = request;

    const todo = user.todos.find((todo) => todo.id === id);

    user.todos.splice(todo, 1);

    return response.status(204).json();
  }
);

module.exports = app;
