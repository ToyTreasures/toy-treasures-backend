const express = require("express");
const upload = require("../utils/multerConfig");
const router = express.Router();

const categoryRouter = (categoryController) => {
  router.get("/", async (req, res) => {
    const categories = await categoryController.getAllCategories();
    res.status(200).send({
      succes: "Categories fetched successfully",
      categories,
    });
  });

  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const category = await categoryController.getCategoryById(id);
    res.status(200).send({
      succes: "Category fetched successfully",
      category,
    });
  });

  router.post(
    "/",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    async (req, res) => {
      const category = { ...req.body, thumbnail: req.files };
      const createdCategory = await categoryController.createCategory(category);
      res.status(201).send({
        succes: "Category created successfully",
        category: createdCategory,
      });
    }
  );

  router.patch(
    "/:id",
    upload.fields([{ name: "thumbnail", maxCount: 1 }]),
    async (req, res) => {
      const { id } = req.params;
      const categoryData = { ...req.body, thumbnail: req.files };
      const category = await categoryController.updateCategory(
        id,
        categoryData
      );
      res.status(200).send({
        succes: "Category updated successfully",
        category,
      });
    }
  );

  router.delete("/:id", async (req, res) => {
    const { id } = req.params;
    const category = await categoryController.deleteCategory(id);
    res.status(200).send({
      succes: "Category deleted successfully",
      category,
    });
  });

  return router;
};

module.exports = categoryRouter;
