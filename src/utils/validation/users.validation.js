const Joi = require("joi");

const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(30).messages({
    "string.min": "Name must be at least 3 characters long",
    "string.max": "Name cannot exceed 30 characters",
    "any.required": "Name is required",
  }),
  email: Joi.string()
    .email()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
    .message("Please enter a valid email address"),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string()
    .required()
    .pattern(new RegExp("^(010|011|012|015)\\d{8}$"))
    .message("Please enter a valid Egyptian phone number"),
  address: Joi.string().required(),
  role: Joi.string().valid("user", "admin").default("user"),
});

module.exports = {
  createUserSchema,
};
