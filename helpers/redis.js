// if (process.env.REDISTOGO_URL) {
//   console.log(`REDIS TO GO URL FOUND ~~~~ ${process.env.REDISTOGO_URL}`);

//     const rtg = require("url").parse(process.env.REDISTOGO_URL);
//     var redis = require("redis").createClient({
//       port: rtg.port,
//       host: rtg.hostname,
//     });
//     console.log(`REDIS AUTH PASSWORD ~~~ ${rtg.auth.split(":")[1]}`);
//     redis.auth(rtg.auth.split(":")[1]);
//     console.log(`REDIS AUTH`);
//     redis.connect();
//     console.log(`REDIS CONNECT`);
//     redis.on("connect", function () {
//       console.log("Redis client connected");
//     });
//     console.log(`REDIS READY`);
//     redis.on("ready", () => {
//       console.log("Redis ready to be used");
//     });
//     console.log(`REDIS ERROR`);
//     redis.on("error", (err) => {
//       console.log(`REDIS CONNECTION ERROR ~~~ ${err}`);
//     });

//     redis.on("end", () => {
//       console.log("Client disconnected from Redis");
//     });
//     console.log(`REDIS CONNECT ~~~ ${redis.isOpen} REDIS.JS`);
//     module.exports = { redis };

//   console.log(`EXITING REDIS TO GO `);
// } else {
//   redis = require("redis").createClient();

//   redis.on("connect", function () {
//     console.log("Redis client connected");
//   });
//   redis.on("ready", () => {
//     console.log("Redis ready to be used");
//   });

//   redis.on("error", (err) => {
//     console.log(`REDIS CONNECTION ERROR ~~~ ${err}`);
//   });

//   redis.on("end", () => {
//     console.log("Client disconnected from Redis");
//   });
//   console.log(`REDIS CLIENT REDIS FILE ~~~ ${redis}`);
//   module.exports = { redis };
// }
require("dotenv")
const redis = require("redis");
console.log(process.env.REDISTOGO_URL)
async function createRedisClient() {
  const rtg = require("url").parse(process.env.REDISTOGO_URL);
  const client = redis.createClient({
    port: rtg.port,
    host: rtg.hostname,
  });

  client.auth(rtg.auth.split(":")[1]);

  client.on("connect", () => console.log("Connected to REDIS!"));
  client.on("error", (err) => console.log("Error connecting to REDIS: ", err));

  await client.connect();

  return client;
}

module.exports = createRedisClient();
