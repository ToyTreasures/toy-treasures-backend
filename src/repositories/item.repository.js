const Item = require("../models/item.model");

class ItemRepository {
  async getAllItems(limit, skip) {
    const itemsNumber = await Item.countDocuments({});
    const pages = Math.ceil(itemsNumber/limit);
    const items = await Item.find({}).skip(skip).limit(limit);
    return {itemsNumber, pages, items};
  }

  async getItemById(id) {
    return await Item.findById(id);
  }

  async createItem(item, userId) {
    const newItem = new Item({ ...item, ownerId: userId });
    return await newItem.save();
  }

  async updateItem(id, newItemData) {
    return await Item.findByIdAndUpdate(id, newItemData, {
      new: true,
      runValidators: true,
    });
  }

  async deleteItem(id) {
    return await Item.findByIdAndDelete(id);
  }
}

module.exports = ItemRepository;
