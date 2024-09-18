const CustomError = require("../utils/CustomError");

class ItemController {
  itemRepository;
  constructor(itemRepository) {
    this.itemRepository = itemRepository;
  }

  async getAllItems(page = "1", limit = "12", filters, search) {
    const skip = (page - 1) * limit;
    const query = [];
    let address = "";
    if (filters) {
      const filtersArray = filters.split("--");
      filtersArray.forEach((filter) => {
        if (filter === "swap") {
          query.push({ isAvailableForSwap: true });
        } else if (filter.includes("minPrice")) {
          const price = filter.split("-")[1];
          query.push({ price: { $gte: price } });
        } else if (filter.includes("maxPrice")) {
          const price = filter.split("-")[1];
          query.push({ price: { $lte: price } });
        } else if (filter.includes("condition")) {
          const conditions = filter.split("-")[1].split("%");
          query.push({ condition: { $in: conditions } });
        } else if (filter.includes("address")) {
          address = filter.split("-")[1];
        }
      });
    }

    if (search) {
      query.push({
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      });
    }

    return await this.itemRepository.getAllItems(limit, skip, query, address);
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
