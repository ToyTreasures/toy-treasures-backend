const CustomError = require("../utils/CustomError");
const {
  createItemSchema,
  updateItemSchema,
  paginatedItemsSchema,
} = require("../utils/validation/item.validation");

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

  async createItem(item) {
    return await this.itemRepository.createItem(item);
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
