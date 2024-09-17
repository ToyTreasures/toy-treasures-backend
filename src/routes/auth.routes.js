const express = require("express");
const auth = require("../middlewares/auth");
const router = express.Router();
const options = {
  httpOnly: true,
};

const authRouter = (authController) => {
  router.post("/register", async (req, res) => {
    const user = await authController.register(req.body);
    res.status(200).send({ success: "User registered successfully", user });
  });

  router.post("/login", async (req, res) => {
    const { accessToken, refreshToken, user } = await authController.login(
      req.body
    );
    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "User logged in successfully",
      accessToken,
      user,
    });
  });

  router.get("/logout", auth, async (req, res) => {
    const { _id: userId } = req.user;
    const user = await authController.logout(userId);
    res
      .status(200)
      .clearCookie("refreshToken", options)
      .send({ success: "User logged out successfully", user });
  });

  router.post("/refresh-token", auth, async (req, res) => {
    const { refreshToken: incommingRefreshToken } = req.cookies;
    if (!incommingRefreshToken)
      return res.status(400).send({ error: "Invalid refresh token" });
    const { accessToken, refreshToken, user } =
      await authController.refreshAccessToken(incommingRefreshToken);
    res.status(200).cookie("refreshToken", refreshToken, options).send({
      success: "Access token refreshed successfully",
      accessToken,
      user,
    });
  });

  return router;
};

module.exports = authRouter;
