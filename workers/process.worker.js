const { Worker } = require("bullmq");

let connection = {
  port: 6379,
  host: "127.0.0.1",
};

function createWorker(queue) {
  return new Worker(`worker-${queue.name}`, async (job) => console.log(job), {
    connection,
  });
}

module.exports = { createWorker };
