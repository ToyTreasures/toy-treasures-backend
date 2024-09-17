const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const util = require("util");
const CustomError = require("../utils/CustomError");
const jwtVerifyAsync = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  const { authorization: accessToken } = req.headers;
  if (!accessToken) throw new CustomError("unAuthenticated", 400);
  const payload = await jwtVerifyAsync(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  const user = await User.findById(payload._id);
  if (!user) throw new CustomError("unAuthenticated", 400);
  req.user = user;
  next();
};
