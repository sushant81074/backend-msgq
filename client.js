const Redis = require("redis");

const redisClient = Redis.createClient({
  url: "redis://127.0.0.1:6379",
});

redisClient
  .connect()
  .then(() => console.log("connected to redis"))
  .catch((e) =>
    console.error("error occured during connecting to redis", e?.message)
  );

// (async () => {
//   for (let i = 0; i < 100; i++) {
//     let res = await redisClient.del(
//       "bull:process-66c0d28fe139fd358ab8dc7f:5" + i,
//       0
//     );
//     console.log(res);
//   }
// })();

module.exports = { redisClient };

// https://lucid.app/lucidchart/c431122a-a3eb-4c1c-869b-eb19e8567d76/edit?invitationId=inv_a7664651-4aba-4f3a-83a5-cf2a9a1fe277
