// app.js
require("dotenv").config();

const express = require("express");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

const app = express();