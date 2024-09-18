const Item = require("../models/item.model");

class ItemRepository {
  async getAllItems(limit, skip, query, address) {
    query = query.length ? query : [{}];

    const items = await Item.find({ $and: query })
      .populate({
        path: "ownerId",
        select: "address",
        match: address ? { address } : {},
      })
      .skip(skip)
      .limit(limit);
  
    const filteredItems = items.filter((item) => item.ownerId || !address);
  
    const itemsNumber = filteredItems.length;
  
    const pages = Math.ceil(itemsNumber / limit);
  
    return { itemsNumber, pages, items: filteredItems };
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
