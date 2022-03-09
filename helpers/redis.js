
require("dotenv").config();
const redis = require("ioredis");
const Queue = require("bull");
const { match: matchWorker } = require("../workers/index");
async function createRedisClient() {
  console.log("redis connection started");
  const rtg = require("url").parse(process.env.REDISTOGO_URL);

  const client = redis.createClient({
    port: rtg.port,
    host: rtg.hostname,
    no_ready_check: true,
    password: rtg.auth.split(":")[1],
  });

  client.auth(rtg.auth.split(":")[1]);

  client.on("connect", () => console.log("Connected to REDIS!"));
  client.on("error", (err) => console.log("Error connecting to REDIS: ", err));

  client.on("ready", () => {
    console.log("Redis Ping!");
    
    ping();
    async function ping() {
      let response = await client.ping();
     
      
      console.log(response);
    }


  });

  return client;
}

module.exports = createRedisClient();
