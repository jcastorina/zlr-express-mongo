const redis = require("redis");
const client = redis.createClient();

// start a separate multi command queue
const multi = client.multi();

// add some commands to the queue
multi.incr("count_cats", redis.print);
multi.incr("count_dogs", redis.print);

// runs a command immediately outside of the `multi` instance
client.mset("count_cats", 100, "count_dogs", 50, redis.print);

// drains the multi queue and runs each command atomically
multi.exec(function(err, replies) {
  console.log(replies); // 101, 51
});