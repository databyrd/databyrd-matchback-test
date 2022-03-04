const Queue = require("bull");
const { match: matchWorker } = require("./workers");
const redisClient = require("./helpers/redis");
if (process.env.REDISTOGO_URL) {
  // const rtg = require("url").parse(process.env.REDISTOGO_URL);
  // var redis = require("redis").createClient({
  //   port: rtg.port,
  //   host: rtg.hostname,
  // });
  // redis.auth(rtg.auth.split(":")[1]);
  // redis.connect();
  // redis.on("connect", function () {
  //   console.log("Redis client connected");
  //   console.log(`${client.connected}`);
  // });
  // redis.on("ready", () => {
  //   console.log("Redis ready to be used");
  // });

  // redis.on("error", (err) => {
  //   console.log(`REDIS CONNECTION ERROR ~~~ ${err}`);
  // });

  // redis.on("end", () => {
  //   console.log("Client disconnected from Redis");
  // });

 

  const match = new Queue("match", {
    redisClient,
  });

  match.process((job, done) => {
    matchWorker(job, done);
  });

  console.log(`MATCH PROCESS COMPLETE`, redisClient);

  const queues = [
    {
      name: "match",
      hostId: "Match Que Managers",
      redis,
    },
  ];
  console.log(`REDIS QUEUES`, queues);
  module.exports = { match, queues };
} else {
  redis = require("redis").createClient();

  const match = new Queue("match", {
    redis,
  });

  match.process((job, done) => {
    matchWorker(job, done);
  });

  const queues = [
    {
      name: "match",
      hostId: "Match Que Managers",
      redis: {
        port: process.env.REDIS_PORT || 6379,
        host: "127.0.0.1",
        db: 1,
      },
    },
  ];

  module.exports = { match, queues };
}

// const match = new Queue("match", {
//   redis,
// });

// match.process((job, done) => {
//   matchWorker(job, done);
// });

// const queues = [
//   {
//     name: "match",
//     hostId: "Match Que Managers",
//     redis: {
//       port: process.env.REDIS_PORT || 6379,
//       host: "127.0.0.1",
//       db: 1,
//     },
//   },
// ];

// module.exports = { match, queues };
