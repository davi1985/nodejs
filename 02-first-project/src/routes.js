const { Router } = require("express");
const crypto = require("node:crypto");

const routes = Router();

let customers = [];

/**
 * Account:
 * id - uuid
 * cpf - string
 * name - string
 * statement - []
 * balance - number
 */

function verifyIfExistsAccountByCPF(request, response, next) {
  const { cpf } = request.headers;

  const customerIndexPosition = customers.findIndex(
    (customer) => customer.cpf === cpf
  );

  if (customerIndexPosition === -1) {
    return response.status(404).json({ error: "Customer not found" });
  }

  request.customer = getCustomer(customerIndexPosition);

  return next();
}

function getCustomer(customerIndexPosition) {
  return customers[customerIndexPosition];
}

routes.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customerAlreadyExists = customers.some(
    (customer) => customer.cpf === cpf
  );

  if (customerAlreadyExists) {
    return response.status(400).json({ error: "Customer already exists!" });
  }

  const newCustomer = {
    id: crypto.randomUUID(),
    cpf,
    name,
    balance: 0.0,
    statement: [],
  };

  customers.push(newCustomer);

  return response.status(201).json(newCustomer);
});

routes.get("/statement", verifyIfExistsAccountByCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json({
    statement: customer.statement,
  });
});

routes.get(
  "/statement/date",
  verifyIfExistsAccountByCPF,
  (request, response) => {
    const { customer } = request;
    const { date } = request.query;

    const dateFormat = new Date(date + " 00:00");

    const statement = customer.statement.filter(
      (statement) =>
        statement.created_at.toDateString() ===
        new Date(dateFormat).toDateString()
    );

    return response.status(200).json({
      statement,
    });
  }
);

routes.post("/deposit", verifyIfExistsAccountByCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;
  customer.balance += amount;

  let statementOperation = {
    amount,
    created_at: new Date(),
    type: "credit",
    balance: customer.balance,
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

routes.post("/withdraw", verifyIfExistsAccountByCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  if (customer.balance >= amount) {
    customer.balance -= amount;
  } else {
    return response.status(400).json({ error: "Insufficient Funds" });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit",
    balance: customer.balance,
  };

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

routes.put("/account", verifyIfExistsAccountByCPF, (request, response) => {
  const { customer } = request;
  const { name } = request.body;

  customer.name = name;

  return response
    .status(200)
    .json({ customer: { id: customer.id, name: customer.name } });
});

routes.get("/account", verifyIfExistsAccountByCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json(customer);
});

routes.delete("/account", verifyIfExistsAccountByCPF, (request, response) => {
  const { customer } = request;

  customers.splice(customer, 1);

  return response.status(204).json();
});

routes.get("/balance", verifyIfExistsAccountByCPF, (request, response) => {
  const { customer } = request;

  return response.status(200).json({ balance: customer.balance });
});

module.exports = routes;
