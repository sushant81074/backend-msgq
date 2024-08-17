const { Queue } = require("bullmq");

function createQueue(name) {
  return new Queue(`process-${name}`, {
    connection: { host: "127.0.0.1", port: 6379 },
  });
}

async function addJob(que, job) {
  let result = await que.add("job", job);

  console.log("result-----------------------------", result);
}

module.exports = { createQueue, addJob };
