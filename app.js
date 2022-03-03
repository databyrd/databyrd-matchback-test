const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const Queue = require("bull");

require("dotenv").config();

const cp = require("child_process");
const app = express();

app.use(timeout("60s"));

// ---------------- ADD THIS ----------------
const cors = require("cors");
app.use(cors());

// --------------------------------
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ---------------- ADD THIS ----------------
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));
// --------------------------------

app.use("/", indexRouter);
app.use("/users", usersRouter);

const taskQueue = new Queue("tasks");

function completeTask(path1, path2) {
  console.log("COMPLETE TASK STARTING");
  // const childProcess = cp.fork("compareService.js");
  // childProcess.send({ fPath1: originalPath, fPath2: comparedPath });
  // childProcess.on("message", (result) => {
  //   console.log(`MATCH REPONSE COMPLETE ~~~~~ ${result}`), res.json({ result });
  // });
  // childProcess.kill(0);
  const childProcess = cp.fork("compareService.js");
  childProcess.send({ fPath1: path1, fPath2: path2 });
  childProcess.on("message", (result) => {
    console.log(`MATCH REPONSE COMPLETE ~~~~~ ${result}`), res.json({ result });
  });
  childProcess.kill(0);
}

app.post("/node-api/compare-large-files", async function (req, res, next) {
  req.setTimeout(60 * 1000);
  const originalPath = req.body.originalId;
  const comparedPath = req.body.compareId;
  const job = await taskQueue.add("tasks", (job) => {
    return job.id;
  });
  console.log(job.id);
  taskQueue.process((job, done) => {
    console.log(job, done);
  });
  // taskQueue.process(async (job) => {
  //   console.log("QUEUE PROCESS STARTED");
  //   const childProcess = cp.fork("compareService.js");
  //   childProcess.send({ fPath1: originalPath, fPath2: comparedPath });
  //   childProcess.on("message", (result) => {
  //     console.log(`MATCH REPONSE COMPLETE ~~~~~ ${result}`),
  //       res.json({ result });
  //   });
  //   childProcess.kill(0);
  // });

  // const childProcess = cp.fork("compareService.js");
  // childProcess.send({ fPath1: originalPath, fPath2: comparedPath });
  // childProcess.on("message", (result) => {
  //   console.log(`MATCH REPONSE COMPLETE ~~~~~ ${result}`), res.json({ result });
  // });
  // childProcess.kill(0);
});

// ---------------- ADD THIS ----------------
// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});
// --------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
