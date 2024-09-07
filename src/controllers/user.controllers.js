const { default: mongoose } = require("mongoose");
const CustomError = require("../utils/CustomError");

class UserController {
  userRepository;
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async getAllUsers() {
    return await this.userRepository.getAllUsers();
  }

  async getUserById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }
    const user = await this.userRepository.getUserById(id);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  }

  async updateUser(id, newUserData) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new CustomError("Invalid user ID", 400);
    }
    const user = await this.userRepository.updateUser(id, newUserData);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return user;
  }
}

module.exports = UserController;
