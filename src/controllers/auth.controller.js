const CustomError = require("../utils/CustomError");
const util = require("util");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSignAsync = util.promisify(jwt.sign);

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
      const token = await jwtSignAsync(
        { userId: user.id },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );
      return { token, user };
    } else {
      throw new CustomError("invalid email or password", 400);
    }
  }
}

module.exports = AuthController;
