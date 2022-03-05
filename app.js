const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const timeout = require("connect-timeout");
const Arena = require("bull-arena");
const Bull = require("bull");
const { queues } = require("./queues");
// const {redis} = require("./helpers/redis");
require("dotenv").config();
// require("./helpers/redis");

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

// --------THIS ENTIRE SECTION IS FOR LARGE FILE UPLOADS ----------- //
if (process.env.REDISTOGO_URL) {
  console.log(`REDIS TO GO URL FOUND ~~~~ ${process.env.REDISTOGO_URL}`);
  async () => {
    const rtg = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient({
      port: rtg.port,
      host: rtg.hostname,
    });
    console.log(`REDIS AUTH PASSWORD ~~~ ${rtg.auth.split(":")[1]}`);
    redis.auth(rtg.auth.split(":")[1]);
    console.log(`REDIS AUTH`);
    redis.connect();
    console.log(`REDIS CONNECT`);
    redis.on("connect", function () {
      console.log("Redis client connected");
    });
    console.log(`REDIS READY`);
    redis.on("ready", () => {
      console.log("Redis ready to be used");
    });
    console.log(`REDIS ERROR`);
    redis.on("error", (err) => {
      console.log(`REDIS CONNECTION ERROR ~~~ ${err}`);
    });

    redis.on("end", () => {
      console.log("Client disconnected from Redis");
    });
    const arenaConfig = Arena(
      {
        Bull,
        queues: [
          {
            name: "match",
            hostId: "Match Que Managers",
            redis,
          },
        ],
      },
      {
        basePath: "/arena",
        disableListen: true,
      }
    );
    console.log(`ARENAS ~~~ ${arenaConfig}`);
    app.use("/", arenaConfig);
    console.log(`EXITING REDIS TO GO `);
  };
}
// const arenaConfig = Arena(
//   {
//     Bull,
//     queues: [
//       {
//         name: "match",
//         hostId: "Match Que Managers",
//         redis,
//       },
//     ],
//   },
//   {
//     basePath: "/arena",
//     disableListen: true,
//   }
// );

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

module.exports = app;
