const express = require("express");
const { default: mongoose } = require("mongoose");
const cors = require("cors");

require("dotenv").config();
const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT;

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(DB_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to mongodb: " + err.message);
  });
