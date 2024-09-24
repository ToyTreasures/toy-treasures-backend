const CustomError = require("../utils/CustomError");
const {
  uploadToImageKit,
  deleteFromImageKit,
  updateImageInImageKit,
} = require("../utils/imageKitConfig");
const {
  createItemSchema,
  updateItemSchema,
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
        if (filter.includes("swap")) {
          const isAvailableForSwap = filter.split("-")[1];
          query.push({ isAvailableForSwap });
        } else if (filter.includes("minPrice")) {
          const price = filter.split("-")[1];
          query.push({ price: { $gte: price } });
        } else if (filter.includes("maxPrice")) {
          const price = filter.split("-")[1];
          query.push({ price: { $lte: price } });
        } else if (filter.includes("condition")) {
          const conditions = filter.split("-")[1].split(",");
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
    const { error } = createItemSchema.validate(item, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 400);
    }
    if (
      !item.thumbnail ||
      !item.thumbnail.thumbnail ||
      item.thumbnail.thumbnail.length === 0
    ) {
      throw new CustomError("Thumbnail is required", 400);
    }
    const thumbnailFile = item.thumbnail.thumbnail[0];
    const imageKitResponse = await uploadToImageKit(
      thumbnailFile,
      thumbnailFile.originalname,
      "items_thumbnails"
    );
    if (!imageKitResponse || !imageKitResponse.url) {
      throw new CustomError("Image upload failed", 500);
    }
    item.thumbnail = imageKitResponse.url;
    item.thumbnailFileId = imageKitResponse.fileId;
    return await this.itemRepository.createItem(item);
  }

  async updateItem(itemId, userId, newItemData) {
    const { error } = updateItemSchema.validate(newItemData, {
      abortEarly: false,
    });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new CustomError(errorMessages.join(", ").replace(/"/g, ""), 400);
    }
    const oldItem = await this.itemRepository.getItemById(itemId);
    if (!oldItem) throw new CustomError("Item not Found", 404);
    if (userId.toString() !== oldItem.ownerId.toString())
      throw new CustomError(
        "You do not have permission to update this data",
        403
      );
    if (
      !newItemData.thumbnail ||
      !newItemData.thumbnail.thumbnail ||
      newItemData.thumbnail.thumbnail.length === 0
    ) {
      delete newItemData.thumbnail;
    } else {
      const thumbnailFile = newItemData.thumbnail.thumbnail[0];
      const imageKitResponse = await updateImageInImageKit(
        oldItem.thumbnailFileId,
        thumbnailFile,
        thumbnailFile.originalname,
        "items_thumbnails"
      );
      newItemData.thumbnail = imageKitResponse.url;
      newItemData.thumbnailFileId = imageKitResponse.fileId;
    }
    const newItem = await this.itemRepository.updateItem(itemId, newItemData);
    return newItem;
  }

  async deleteItem(itemId, userId) {
    const item = await this.itemRepository.getItemById(itemId);
    if (!item) throw new CustomError("Item not Found", 404);
    if (userId.toString() !== item.ownerId.toString())
      throw new CustomError(
        "You do not have permission to delete this data",
        403
      );
    const deletedItem = await this.itemRepository.deleteItem(itemId);
    await deleteFromImageKit(deletedItem.thumbnailFileId);
    return deletedItem;
  }
}

module.exports = ItemController;
