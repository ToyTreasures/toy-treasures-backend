const User = require("../models/user.model");

class UserRepository {
  async getAllUsers() {
    return await User.find({});
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async updateUser(id, newUserData) {
    return await User.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
    });
  }
}

module.exports = UserRepository;
