const express = require("express");
const { default: mongoose } = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
require("express-async-errors");
const cors = require("cors");

require("dotenv").config();
const DB_URL = process.env.DB_URL;
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

const mainRouter = express.Router();

app.use(cors());
app.use(express.json());

mainRouter.use("/users", userRoutes(userController));
mainRouter.use("/items", itemRoutes(itemController));
mainRouter.use("/auth", authRoutes(authController));

app.use("/api/v1", mainRouter);

app.use(errorHandler); //global error middleware

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
