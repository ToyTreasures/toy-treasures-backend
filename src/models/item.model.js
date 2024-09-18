const { Schema, model, default: mongoose } = require("mongoose");

const itemSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      maxlength: 500,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 1,
    },
    condition: {
      type: String,
      required: [true, "Condition is required"],
    },
    isAvailableForSwap: {
      type: Boolean,
      default: false,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Item = model("Item", itemSchema);

module.exports = Item;
