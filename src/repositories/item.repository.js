const Item = require("../models/item.model");

class ItemRepository {
  async getAllItems() {
    return await Item.find({});
  }

  async getItemById(id) {
    return await Item.findById(id);
  }

  async createItem(item, userId) {
    const newItem = new Item({ ...item, ownerId: userId });
    await newItem.save();
  }

  async updateItem(id, newItemData) {
    return await Item.findByIdAndUpdate(id, newItemData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteItem(id) {
    return await findByIdAndDelete(id);
  }
}

module.exports = ItemRepository;
