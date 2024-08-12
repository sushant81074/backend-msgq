const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(
      "mongodb://localhost:27017/msg_q",
      {}
    );

    if (connection) console.log("db connection successful");
  } catch (error) {
    console.error("error occured during database connection", error?.message);

    process.exit(1);
  }
};

module.exports = {
  dbConnect,
};
