const Joi = require("joi");

const contactUsSchema = Joi.object({
  fullName: Joi.string().required().min(2).max(50).messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 50 characters",
    "any.required": "Full name is required",
  }),
  email: Joi.string()
    .email()
    .required()
    .pattern(new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"))
    .message("Please enter a valid email address"),
  messageText: Joi.string().required().min(10).max(1000).messages({
    "string.min": "Message must be at least 10 characters long",
    "string.max": "Message cannot exceed 1000 characters",
    "any.required": "Message is required",
  }),
});

module.exports = {
  contactUsSchema,
};