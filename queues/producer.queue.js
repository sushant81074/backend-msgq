const { Queue } = require("bullmq");

let jobCount = 0;

function createQueue(name) {
  return new Queue(`process-${name}`, {
    connection: { host: "127.0.0.1", port: 6379 },
  });
}

async function addJob(que, job) {
  let result = await que.add("job" + jobCount++, job);

  console.log("result-----------------------------", result.name, result.data);
}

module.exports = { createQueue, addJob };
