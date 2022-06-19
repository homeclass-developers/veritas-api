const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const { packageRouter } = require("./routes/packages");
const { applicationRouter } = require("./routes/application");
const app = express();

dotenv.config();

const Port = process.env.PORT || 5004;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((error) => {
    console.log(error);
  });

app.use(cors());
app.use(express.json());

// routes

app.use("/api", packageRouter);
app.use("/api", applicationRouter)
app.listen(Port, () => {
  console.log("App connected successfully on Port " + Port);
});
