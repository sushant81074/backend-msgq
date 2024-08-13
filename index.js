const app = require("express")();
const { json, urlencoded } = require("express");
const cors = require("cors");
const env = require("dotenv");
const { dbConnect } = require("./db/index");
const userRouter = require("./routes/user.routes");

env.config({ path: "./local.env" });
dbConnect();

app.use(cors({ origin: "*" }));
app.use(json());
app.use(urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ statusCode: 200, message: "home page of bcnd-msg-q" });
});

app.use("/user", userRouter.router);

app.listen(process.env.PORT, () =>
  console.log(`server running on port : ${process.env.PORT}`)
);
