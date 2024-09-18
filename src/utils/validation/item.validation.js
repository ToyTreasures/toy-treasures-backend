const Joi = require("joi");
const mongoose = require("mongoose");

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().max(500).optional(),
  price: Joi.number().min(1).required(),
  condition: Joi.string().required(),
  isAvailableForSwap: Joi.boolean().default(false),
  ownerId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "valid MongoDB ObjectId")
    .optional(),
});

const updateItemSchema = createItemSchema.fork(["name", "price", "condition"], (schema) =>
  schema.optional()
);

const paginatedItemsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(12),
  condition: Joi.string().optional(),
  isAvailableForSwap: Joi.boolean().optional(),
});

module.exports = {
  createItemSchema,
  updateItemSchema,
  paginatedItemsSchema,
};
