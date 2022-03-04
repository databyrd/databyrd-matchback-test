const Queue = require("bull");
const { match: matchWorker } = require("./workers");

if (process.env.REDISTOGO_URL) {
  console.log(`REDIS TO GO URL ~~~ ${process.env.REDISTOGO_URL}`);
  const rtg = require("url").parse(process.env.REDISTOGO_URL);
  console.log(`REDIS TO GO RTG ~~~ ${rtg}`);
  console.log(`REDIS TO GO PORT ~~~ ${rtg.port}`);
  console.log(`REDIS TO GO HOST NAME ~~~ ${rtg.hostname}`);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);

  redis.auth(rtg.auth.split(":")[1]);
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
} else {
  redis = require("redis").createClient();
  console.log(`REDIS NOT FOUND ~~~ ${redis}`);
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
