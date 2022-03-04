const Queue = require("bull");
const { match: matchWorker } = require("./workers");

if (process.env.REDISTOGO_URL) {
  const rtg = require("url").parse(process.env.REDISTOGO_URL);
  var redis = require("redis").createClient(rtg.port, rtg.hostname);
  redis.auth(rtg.auth.split(":")[1]);

  redis.on("error", (err) => {
    console.log(`REDIS CONNECTION ERROR ~~~ ${err}`);
  });

  const match = new Queue("match", {
    redis,
  });

  console.log(`NEW QUE COMPLETE`, redis.stat);

  match.process((job, done) => {
    matchWorker(job, done);
  });

  console.log(`MATCH PROCESS COMPLETE`);

  const queues = [
    {
      name: "match",
      hostId: "Match Que Managers",
      redis,
    },
  ];
  console.log(`QUEUES ~~~ ${queues}`);

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
