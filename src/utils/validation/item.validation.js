const Joi = require("joi");
const mongoose = require("mongoose");

const validCategoryNames = [
  "Action Figures",
  "Stuffed Animals",
  "Wooden Toys",
  "Puzzle",
  "Doll & Plush",
  "Technology",
];

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().max(500).required(),
  price: Joi.number().min(1).required(),
  condition: Joi.string().required(),
  category: Joi.string()
    .valid(...validCategoryNames)
    .required(),
  isAvailableForSwap: Joi.boolean().default(false),
  thumbnail: Joi.required(),
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
