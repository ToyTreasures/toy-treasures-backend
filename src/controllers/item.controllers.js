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

  async getAllItems(page = "1", limit = "12") {
    try {
      const { error, value } = paginatedItemsSchema.validate({ page, limit });
      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new CustomError(errorMessages.join(", "), 400);
      }
      const skip = (page - 1) * limit;
      return await this.itemRepository.getAllItems(value.limit, skip);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(error.message, 500);
    }
  }

  async getItemById(id) {
    const item = await this.itemRepository.getItemById(id);
    if (!item) {
      throw new CustomError("Item not found", 404);
    }
    return item;
  }

  async createItem(item, userId) {
    try {
      const { error, value } = createItemSchema.validate({ ...item, ownerId: userId });

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new CustomError(errorMessages.join(", "), 400);
      }

      return await this.itemRepository.createItem(value, userId);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(error.message, 500);
    }
  }

  async updateItem(id, newItemData) {
    try {
      const { error, value } = updateItemSchema.validate(newItemData);

      if (error) {
        const errorMessages = error.details.map((detail) => detail.message);
        throw new CustomError(errorMessages.join(", "), 400);
      }

      const item = await this.itemRepository.updateItem(id, value);
      if (!item) {
        throw new CustomError("Item not Found", 404);
      }
      return item;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new CustomError(error.message, 500);
    }
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
