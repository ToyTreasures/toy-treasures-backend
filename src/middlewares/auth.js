const CustomError = require("../utils/CustomError");
const util = require("util");
const jwt = require("jsonwebtoken");
const jwtVerifyAsync = util.promisify(jwt.verify);

module.exports = async (req, res, next) => {
  const { authorization: accessToken } = req.headers;
  if (!accessToken) throw new CustomError("Unauthorized", 401);
  const payload = await jwtVerifyAsync(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET
  );
  req.user = payload;
  next();
};
