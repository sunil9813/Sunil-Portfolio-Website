const mongoose = require("mongoose");
const { DATABASE_CLOUD } = require("../../utils/variables");

const ConnectDB = () => {
  mongoose
    .connect(DATABASE_CLOUD)
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log("Database connection failed");
      console.log(error);
    });
};

module.exports = ConnectDB;
