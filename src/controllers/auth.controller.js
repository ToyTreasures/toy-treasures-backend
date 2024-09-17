const CustomError = require("../utils/CustomError");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtVerifyAsync = util.promisify(jwt.verify);
const { generateAccessAndRefreshTokens } = require("../utils/jwtHelpers");

class AuthController {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    //joi validation on userData(req.body) first
    //validation in case like this could be put in pre"save" script in the user model
    const existingUser = await this.userRepository.getUserByEmail(
      userData.email
    );
    if (existingUser) throw new CustomError("Email already exists", 409);
    const user = await this.userRepository.createUser(userData);
    return user;
  }

  async login(userData) {
    const user = await this.userRepository.getUserByEmail(userData.email);
    if (!user) throw new CustomError("invalid email or password", 400);
    if (!userData.password) throw new CustomError("Password is required", 400);
    const isMatched = await bcrypt.compare(userData.password, user.password);

    if (isMatched) {
      const { accessToken, refreshToken } =
        await generateAccessAndRefreshTokens(
          user._id.toString(),
          this.userRepository.getUserById,
          this.userRepository.saveUserWithoutValidation
        );
      return { accessToken, refreshToken, user };
    } else {
      throw new CustomError("invalid email or password", 400);
    }
  }

  async logout(userData) {
    const user = await this.userRepository.updateUser(userData._id, {
      $set: { refreshToken: null },
    });
    return user;
  }

  async refreshAccessToken(incommingRefreshToken) {
    if (!incommingRefreshToken)
      throw new CustomError("Refresh token is required", 401);
    const decodedToken = await jwtVerifyAsync(
      incommingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await this.userRepository.getUserById(decodedToken?._id);
    if (!user) throw new CustomError("Refresh token is required", 401);
    if (incommingRefreshToken !== user.refreshToken)
      throw new CustomError("Invalid refresh token", 401);
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id.toString(),
      this.userRepository.getUserById,
      this.userRepository.saveUserWithoutValidation
    );
    return { accessToken, refreshToken, user };
  }
}

module.exports = AuthController;
