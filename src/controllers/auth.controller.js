const CustomError = require("../utils/CustomError");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignAsync = util.promisify(jwt.sign);
const { createUserSchema } = require("../utils/validation/users.validation");
require("dotenv").config();

class AuthController {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async register(userData) {
    try {
      const { error, value } = createUserSchema.validate(userData, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new CustomError(errorMessages.join(", "), 400);
      }
      const existingUser = await this.userRepository.getUserByEmail(userData.email);
      if (existingUser) throw new CustomError("Email already exists", 409);
      const user = await this.userRepository.createUser(value);
      return user;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(error.message, 500);
    }
  }

  async login(userData) {
    const user = await this.userRepository.getUserByEmail(userData.email);
    if (!user) throw new CustomError("invalid email or password", 400);
    if (!userData.password) throw new CustomError("Password is required", 400);
    const isMatched = await bcrypt.compare(userData.password, user.password);
    if (isMatched) {
      const token = await jwtSignAsync({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return { token, user };
    } else {
      throw new CustomError("invalid email or password", 400);
    }
  }
}

module.exports = AuthController;
