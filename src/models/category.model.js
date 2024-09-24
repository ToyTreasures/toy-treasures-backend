const { Schema, model, default: mongoose } = require("mongoose");

const categorySchema = Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "Name is required"],
    },
    description: {
      type: String,
      maxlength: 500,
      required: [true, "Description is required"],
    },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: "Item" }],
    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
    },
    thumbnailFileId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.thumbnailFileId;
        delete ret.__v;
        delete ret.updatedAt;
        delete ret.createdAt;
      },
    },
  }
);

const Category = model("Category", categorySchema);

module.exports = Category;
