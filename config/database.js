const mongoose = require("mongoose");
require("dotenv").config();

exports.dbConnect = async () => {
  mongoose
    .connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Database connected successfully."))
    .catch((err) => {
        console.log("db connection err", err);
        console.log("failed to connect with database.");
        process.exit(1);
    });
};
