const rtg = require("url").parse(process.env.REDISTOGO_URL);
exports.config = {
  redis: {
    port: rtg.port,
    host: rtg.hostname,
    no_ready_check: true,
    password: rtg.auth.split(":")[1]
  }
 
}