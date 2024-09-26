const express = require("express");
const checkRole = require("../middlewares/checkRole");
const auth = require("../middlewares/auth");
const upload = require("../utils/multerConfig");
const router = express.Router();

const itemRouter = (itemController) => {
  router.get("/", async (req, res) => {
    const { page, limit, filters, search } = req.query;
    const { itemsNumber, pagesNumber, items } =
      await itemController.getAllItems(page, limit, filters, search);
    res.status(200).send({
      success: "All items fetched successfully",
      items,
      paginationMetaData: { itemsNumber, pagesNumber },
    });
  });

  router.get("/user-items/:id", async (req, res) => {
    const { id: userId } = req.params;
    const items = await itemController.getUserItems(userId);
    res.status(200).send({ success: "User Items fetched successfully", items });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await itemController.getItemById(id);
    res.status(200).send({ success: "Item fetched successfully", item });
  });

  router.post(
    "/",
    auth,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    async (req, res) => {
      const ownerId = req.user._id;
      const thumbnail = req.files;
      const item = { ...req.body, thumbnail, ownerId };

      const createdItem = await itemController.createItem(item);

      res
        .status(200)
        .send({ success: "Item created successfully", item: createdItem });
    }
  );

  router.patch(
    "/:id",
    auth,
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    async (req, res) => {
      const { id: itemId } = req.params;
      const { _id: userId } = req.user;
      const itemData = { ...req.body };

      if (req.files && req.files.thumbnail && req.files.thumbnail.length > 0) {
        const thumbnailFile = req.files.thumbnail[0];
        itemData.thumbnail = thumbnailFile;
      }

      const updatedItem = await itemController.updateItem(
        itemId,
        userId,
        itemData
      );
      res
        .status(200)
        .send({ success: "Item updated successfully", updatedItem });
    }
  );

  router.delete("/:id", auth, async (req, res) => {
    const { id: itemId } = req.params;
    const { _id: userId } = req.user;
    const item = await itemController.deleteItem(itemId, userId);
    res.status(200).send({ success: "Item deleted successfully", item });
  });

  return router;
};

module.exports = itemRouter;
