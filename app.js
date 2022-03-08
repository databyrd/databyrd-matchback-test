const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
require("dotenv").config();
const app = express();
const Queue = require("bull");
// const redisClient = "./helpers/redis";
const Arena = require("bull-arena");
const Bull = require("bull");
// const { match: matchWorker } = require("./workers/index");
const { queues } = require("./queues");
app.use(timeout("60s"));

// ---------------- ADD THIS ----------------
const cors = require("cors");
// const { redis } = require("./helpers/redis");
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
// const match = new Queue("match", {
//   redisClient,
// });

// match.process((job, done) => {
//   console.log(" MATCH WORKER - APP.JS MATCH.PROCESS");
//   matchWorker(job, done);
// });
// const queues = [
//   {
//     name: "match",
//     hostId: "Match Que Managers",
//     redisClient,
//   },
// ];

const arenaConfig = Arena(
  {
    Bull,
    queues,
  },
  {
    basePath: "/arena",
    disableListen: true,
  }
);

app.use("/", arenaConfig);
// --------THIS ENTIRE SECTION IS FOR LARGE FILE UPLOADS ----------- //
app.use("/", indexRouter);
app.use("/users", usersRouter);
// --------END LARGE FILE UPLOAD SECTION ----------- //

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

// process.on("SIGINT", function () {
//   redis.quit();
//   console.log("redis client quit");
// });

module.exports = app;
