const Queue = require("bull");
const { match: matchWorker } = require("./workers/index");
const redisClient = require("./helpers/redis");

console.log(`REDIS CLIENT ~~~ ${redisClient.status}`);

async function createQueues(){

}

const match = new Queue("match", {
  redisClient,
});

match.process((job, done) => {
  matchWorker(job, done);
});

const queues = [
  {
    name: "match",
    hostId: "Match Que Managers",
    redisClient,
  },
];

module.exports = { match, queues };
