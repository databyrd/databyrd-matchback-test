const Queue = require("bull");
const { match: matchWorker } = require("./workers");
const redisClient = require("./helpers/redis");
if (process.env.REDISTOGO_URL) {
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
      redisClient,
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
      redis
    },
  ];
  console.log(`QUEUES FROM QUEUE PAGE ${queues}`)

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
