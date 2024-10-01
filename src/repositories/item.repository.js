const Item = require("../models/item.model");

class ItemRepository {
  async getAllItems(limit, skip, query, address) {
    query = query.length ? query : [{}];

    const totalItems = await Item.countDocuments({ $and: query }).populate({
      path: "ownerId",
      select: "address",
      match: address ? { address } : {},
    });

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

    const pagesNumber = Math.ceil(totalItems / limit);

    return { itemsNumber, pagesNumber, items: filteredItems };
  }

  async getUserItems(userId) {
    return await Item.find({ ownerId: userId });
  }

  async getItemById(id) {
    return await Item.findById(id);
  }

  async getUserItems(userId) {
    return await Item.find({ ownerId: userId })
      .select("thumbnail name description price condition")
      .exec();
  }

  async createItem(item) {
    console.log(item);
    const newItem = new Item(item);
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
