const redis = require("redis");

const client = redis.createClient();

client.watch("foo", function(watchError) {
  if (watchError) throw watchError;

  client.get("foo", function(getError, result) {
    if (getError) throw getError;

    // Process result
    // Heavy and time consuming operation here to generate "bar"

    client
      .multi()
      .set("foo", "bar")
      .exec(function(execError, results) {
        /**
         * If err is null, it means Redis successfully attempted
         * the operation.
         */
        if (execError) throw err;

        /**
         * If results === null, it means that a concurrent client
         * changed the key while we were processing it and thus
         * the execution of the MULTI command was not performed.
         *
         * NOTICE: Failing an execution of MULTI is not considered
         * an error. So you will have err === null and results === null
         */
      });
  });
});