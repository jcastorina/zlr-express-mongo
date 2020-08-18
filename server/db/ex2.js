const redis = require("redis");

const client = redis.createClient();


client
  .multi()
  .script("load", "return 1", redis.print)
  .exec();
