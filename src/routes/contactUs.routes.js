const express = require("express");
const router = express.Router();

const contactUsRouter = (contactUsController) => {
  router.post("/", async (req, res) => {
    const sendEmail = await contactUsController.sendEmail(req.body);
    res.status(200).json(sendEmail);
  });

  router.get("/", async (req, res) => {
    const emails = await contactUsController.getAllEmails();
    res.status(200).json(emails);
  });

  router.delete("/", async (req, res) => {
    const deletedEmails = await contactUsController.deleteAllEmails();
    res.status(200).json({ deletedEmails });
  });

  return router;
};

module.exports = contactUsRouter;
