const { default: mongoose } = require("mongoose");
const Wishlist = require("../models/wishlist.model");
const CustomError = require("../utils/CustomError");

class WishlistRepository {
  async createWishlist(userId) {
    const wishlist = new Wishlist({ ownerId: userId });
    return await wishlist.save();
  }

  async getWishlistByUserId(userId) {
    return await Wishlist.findOne({ ownerId: userId });
  }

  async getWishlist(userId) {
    if (!userId) throw new CustomError("User ID is required", 400);
    const wishlist = await this.wishlistRepository.getWishlistByUserId(userId);
    if (!wishlist) throw new CustomError("Wishlist not found", 404);
    return wishlist;
  }

  async addItemToWishlist(userId, itemId) {
    return await Wishlist.findOneAndUpdate(
      { ownerId: userId },
      { $addToSet: { items: itemId } },
      { new: true }
    );
  }

  async removeItemFromWishlist(userId, itemId) {
    const itemObjectId = new mongoose.Types.ObjectId(itemId);
    return await Wishlist.findOneAndUpdate(
      { ownerId: userId },
      { $pull: { items: itemObjectId } },
      { new: true }
    );
  }

  async clearWishlist(userId) {
    return await Wishlist.findOneAndUpdate(
      { ownerId: userId },
      { $set: { items: [] } },
      { new: true }
    );
  }
}

module.exports = WishlistRepository;
