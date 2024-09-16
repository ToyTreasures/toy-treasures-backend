const CustomError = require("../utils/CustomError");

class ItemController {
  itemRepository;
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  async getAllItems() {
    return await this.itemRepository.getAllItems();
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

  async updateItem(id, newItemData) {
    const item = await this.itemRepository.updateItem(id, newItemData);
    if (!item) {
      throw new CustomError("Item not Found", 404);
    }
    return item;
  }

  async deleteItem(id) {
    const item = await this.itemRepository.deleteItem(id);
    if (!item) {
      throw new CustomError("Invalid item id");
    }
    return item;
  }
}

module.exports = ItemController;
