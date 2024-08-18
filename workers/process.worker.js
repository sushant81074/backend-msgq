const { Worker } = require("bullmq");
const fs = require("fs");
const path = require("path");

let connection = {
  port: 6379,
  host: "127.0.0.1",
};

function createWorker(queue) {
  let worker = new Worker(
    `${queue.name}`,
    async (job) => {
      console.log("job=======", job.id, "job data =======", job.data);

      fs.appendFile(
        path.join(__dirname + "/result.txt"),
        JSON.stringify({ id: job.id, data: job.data }) + "\n",
        "utf-8",
        (err) => {
          console.log("error ", err?.message);
        }
      );
    },
    {
      connection,
    }
  );

  worker.on("active", async (job) =>
    console.log("job of worker", job.debounceId)
  );
  worker.on("completed", async (job) => {
    console.log("job status", {
      a: await job.isActive(),
      c: await job.isCompleted(),
      d: await job.isDelayed(),
      f: await job.isFailed(),
      w: await job.isWaiting(),
      data: job.data,
      id: job.id,
      workerid: worker.id,
    });

    console.log("j.r----------------------------", await job.remove());
  });

  return worker;
}

module.exports = { createWorker };
