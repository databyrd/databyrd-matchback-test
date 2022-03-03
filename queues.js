const Queue = require("bull");
const { match: matchWorker } = require("./workers");

if (process.env.REDISTOGO_URL) {
  const rtg = require("url").parse(process.env.REDISTOGO_URL);
  const redis = require("redis").createClient(rtg.port, rtg.hostname);

  console.log(redis);
  redis.auth(rtg.auth.split(":")[1]);
} else {
  redis = require("redis").createClient();
}

// const match = new Queue("match", {
//   redis: {
//     port: process.env.REDIS_PORT || 6379,
//     host: "127.0.0.1",
//     db: 1,
//   },
// });

const match = new Queue("match", {
  redis,
});

match.process((job, done) => {
  matchWorker(job, done);
});

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

const queues = [
  {
    name: "match",
    hostId: "Match Que Managers",
    redis,
  },
];

module.exports = { match, queues };
