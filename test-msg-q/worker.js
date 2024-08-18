const { Worker } = require("bullmq");

const createWorker = async (que) => {
  console.log("que", que.name);

  const worker = new Worker(
    que.name,
    async (job) => console.log("job", job.data),
    {
      connection: {
        port: 6379,
        host: "127.0.0.1",
      },
    }
  );

  console.log("worker.id", worker.id, "worker.name", worker.name);
};

createWorker({ name: "hula" });

module.exports = { createWorker };
