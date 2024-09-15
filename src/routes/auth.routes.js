const express = require("express");
const router = express.Router();

const authRouter = (authController) => {
  router.post("/register", async (req, res) => {
    const user = await authController.register(req.body);
    res.status(200).send({ success: "User registered successfully", user });
  });

  router.post("/login", async (req, res) => {
    const { token, user } = await authController.login(req.body);
    res
      .status(200)
      .send({ success: "User logged in successfully", token, user });
  });

  return router;
};

module.exports = authRouter;
