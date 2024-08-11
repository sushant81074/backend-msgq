const mongoose = require("mongoose");

const dbConnect = async () => {
  try {
    const connection = await mongoose.connect(process.env.DB_URL, {});

    if (connection) console.log("db connection successful");
  } catch (error) {
    console.error("error occured during database connection");

    process.exit(1);
  }
};

module.exports = {
  dbConnect,
};
