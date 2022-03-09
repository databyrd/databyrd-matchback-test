const Queue = require("bull");
const { match: matchWorker } = require("./workers/index");
const redisClient = require("./helpers/redis");
const {
  config: { redis },
} = require("./config");

console.log(`REDIS CLIENT ~~~ ${redisClient}`);

const match = new Queue("match", {
  redis,
});

match.process((job, done) => {
  console.log(`MATCH PROCESS QUEUEUS`);
  matchWorker(job, done);
});

const queues = [
  {
    name: "match",
    hostId: "Match Que Managers",
    redis,
  },
];

module.exports = { match, queues };
