const User = require("../models/user.model");

class UserRepository {
  async getAllUsers() {
    return await User.find({});
  }

  async getUserById(id) {
    return await User.findById(id);
  }

  async getUserByEmail(email) {
    return await User.findOne({ email });
  }

  async createUser(userData) {
    const user = new User({ ...userData });
    return await user.save();
  }

  async updateUser(id, newUserData) {
    return await User.findByIdAndUpdate(id, newUserData, {
      new: true,
      runValidators: true,
    });
  }

  async saveUserWithoutValidation(user) {
    await user.save({ validateBeforeSave: false });
  }
}

module.exports = UserRepository;
