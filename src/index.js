const express = require("express");
const { default: mongoose } = require("mongoose");
const errorHandler = require("./middlewares/errorHandler");
require("express-async-errors");
const cors = require("cors");

require("dotenv").config();
const DB_URI = process.env.DB_URI;
const PORT = process.env.PORT;

const userRoutes = require("./routes/user.routes");
// const todoRoutes = require("./routes/todo.routes");

const UserController = require("./controllers/user.controllers");
// const TodoController = require("./controllers/todo.controllers");

const UserRepository = require("./repositories/user.repository");
// const TodoRepository = require("./repositories/todo.repository");

const userRepository = new UserRepository();
// const TodoRepository = new TodoRepository();

const userController = new UserController(userRepository);
// const todoController = new TodoController(todoRepository);

const app = express();

const mainRouter = express.Router();

app.use(cors());
app.use(express.json());

mainRouter.use("/users", userRoutes(userController));
// mainRouter.use("/todos", todoRoutes(todoController));

app.use("/api/v1", mainRouter);

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
