const { Queue } = require("bullmq");

let jobCounter = 0;

const createQue = async (name, job) => {
  console.log("name", name, "job----------------", job);
  const queue = new Queue(name, {
    connection: { port: 6379, host: "127.0.0.1" },
  });

  queue.add("job" + jobCounter++, job);

  console.log("queue.name", queue.name);
};

setInterval(async () => {
  let result = await createQue("hula", jobCounter);

  console.log(result);
}, 2000);

module.exports = { createQue };
