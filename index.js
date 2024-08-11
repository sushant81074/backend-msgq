const app = require("express")();
const { json, urlencoded } = require("express");
const cors = require("cors");
const env = require("dotenv");
const { dbConnect } = require("./db");

dbConnect();

app.use(cors({ origin: "*" }));
env.config({ path: "./secret.env" });
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.status(200).send({ statusCode: 200, message: "home page" });
});

app.listen(process.env.PORT, () =>
  console.log(`server running on port : ${process.env.PORT}`)
);
