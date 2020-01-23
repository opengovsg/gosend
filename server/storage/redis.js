const promisify = require('util').promisify;

module.exports = function(config) {
  const redis_lib =
    config.env === 'development' && config.redis_host === 'localhost'
      ? 'redis-mock'
      : 'redis';

  //eslint-disable-next-line security/detect-non-literal-require
  const redis = require(redis_lib);
  const options = config.redis_host.startsWith('redis://') ?  { url: config.redis_host } : { host: config.redis_host }
  const client = redis.createClient({
    ...options,
    retry_strategy: options => {
      if (options.total_retry_time > 10000) {
        client.emit('error', 'Retry time exhausted');
        return new Error('Retry time exhausted');
      }

      return 500;
    }
  });

  client.ttlAsync = promisify(client.ttl);
  client.hgetallAsync = promisify(client.hgetall);
  client.hgetAsync = promisify(client.hget);
  client.pingAsync = promisify(client.ping);
  return client;
};
