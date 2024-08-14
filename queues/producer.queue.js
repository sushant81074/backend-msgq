const { Queue } = require("bullmq");

function createQueue(name) {
  return new Queue(`user-${name}`, {
    connection: { host: "127.0.0.1", port: 6379 },
  });
}

module.exports = { createQueue };
