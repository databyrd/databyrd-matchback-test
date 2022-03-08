const Queue = require("bull");
const { match: matchWorker } = require("./workers/index");
const redisClient = require("./helpers/redis");


  const match = new Queue("match", {
    redisClient,
  });

  match.process((job, done) => {
    matchWorker(job, done);
  });

console.log(redisClient)

  const queues = [
    {
      name: "match",
      hostId: "Match Que Managers",
      redisClient,
    },
  ];
 
  module.exports = { match, queues };