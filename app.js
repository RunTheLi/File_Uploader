// app.js
const express = require("express");

const indexRouter = require("./routes/indexRouter");
const authRouter = require("./routes/authRouter");
const folderRouter = require("./routes/folderRouter");
const fileRouter = require("./routes/fileRouter");

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/folders", folderRouter);
app.use("/files", fileRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).render("404");
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
