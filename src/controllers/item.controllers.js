const CustomError = require("../utils/CustomError");

class ItemController {
  itemRepository;
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  async getAllItems(page = "1", limit = "12") {
    const skip = (page - 1) * limit;
    return await this.itemRepository.getAllItems(limit, skip);
  }

  async getItemById(id) {
    const item = await this.itemRepository.getItemById(id);
    if (!item) {
      throw new CustomError("Item not found", 404);
    }
    return item;
  }

  async createItem(item, userId) {
    return await this.itemRepository.createItem(item, userId);
  }

  async updateItem(itemId, userId, newItemData) {
    const oldItem = await this.itemRepository.getItemById(itemId);
    if (!oldItem) throw new CustomError("Item not Found", 404);
    if (userId.toString() !== oldItem.ownerId.toString())
      throw new CustomError("Unauthorized to update this item", 401);
    const newItem = await this.itemRepository.updateItem(itemId, newItemData);
    return newItem;
  }

  async deleteItem(itemId, userId) {
    const item = await this.itemRepository.getItemById(itemId);
    if (!item) throw new CustomError("Item not Found", 404);
    if (userId.toString() !== item.ownerId.toString())
      throw new CustomError("Unauthorized to delete this item", 401);
    const deletedItem = await this.itemRepository.deleteItem(itemId);
    return deletedItem;
  }
}

module.exports = ItemController;
