const express = require("express");
const { default: mongoose } = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
require("express-async-errors");
const cors = require("cors");
const morgan = require("morgan")

require("dotenv").config();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

const userRoutes = require("./routes/user.routes");
const itemRoutes = require("./routes/item.routes");
const authRoutes = require("./routes/auth.routes");

const UserController = require("./controllers/user.controllers");
const ItemController = require("./controllers/item.controllers");
const AuthController = require("./controllers/auth.controller");

const UserRepository = require("./repositories/user.repository");
const ItemRepository = require("./repositories/item.repository");

const userRepository = new UserRepository();
const itemRepository = new ItemRepository();

const userController = new UserController(userRepository);
const itemController = new ItemController(itemRepository);
const authController = new AuthController(userRepository);

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("short"));

app.use("/users", userRoutes(userController));
app.use("/items", itemRoutes(itemController));
app.use("/auth", authRoutes(authController));

app.use(errorHandler); //global error middleware

mongoose
  .connect(DB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("error connecting to mongodb: " + err.message);
  });
