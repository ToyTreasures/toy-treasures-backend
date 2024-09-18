const express = require("express");
const router = express.Router();

const itemRouter = (itemController) => {
  router.get("/", async (req, res) => {
    const { page, limit, filters } = req.query;
    const { itemsNumber, pages, items } = await itemController.getAllItems(
      page,
      limit,
      filters
    );
    res
      .status(200)
      .send({
        success: "All items fetched successfully",
        items,
        paginationMetaData: { itemsNumber, pages },
      });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await itemController.getItemById(id);
    res.status(200).send({ success: "Item fetched successfully", item });
  });

  router.post("/", async (req, res) => {
    const item = await itemController.createItem(
      req.body,
      "66e57d5d19e130df45b391e2"
    );
    res.status(200).send({ success: "Item created successfully", item });
  });

  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await itemController.updateItem(id, req.body);
    res.status(200).send({ success: "Item updated successfully", item });
  });

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const item = await itemController.deleteItem(id);
    res.status(200).send({ success: "Item deleted successfully", item });
  });

  return router;
};

module.exports = itemRouter;
