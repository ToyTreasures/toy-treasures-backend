const Joi = require("joi");
const mongoose = require("mongoose");

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().min(1).required(),
  condition: Joi.string().required(),
  isAvailableForSwap: Joi.boolean().default(false).required(),
  ownerId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    }, "valid MongoDB ObjectId")
    .optional(),
});

const updateItemSchema = createItemSchema.fork(
  ["name", "price", "condition", "description"],
  (schema) => schema.optional()
);

module.exports = {
  createItemSchema,
  updateItemSchema,
};
