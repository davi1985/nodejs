const express = require("express");

const app = express();

app.list(3000, () => console.log("Server is running"));
