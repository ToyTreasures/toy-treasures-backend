const nodemailer = require("nodemailer");
require("dotenv").config();
const { contactUsSchema } = require("../utils/validation/contactUs.validation.js");

class ContactUsController {
  constructor(contactUsRepository) {
    this.contactUsRepository = contactUsRepository;
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.APP_PASSWORD,
      },
    });
  }

  async deleteAllEmails() {
    await this.contactUsRepository.deleteAllEmails();
    return { message: "All emails deleted successfully" };
  }

  async sendEmail(MessageData) {
    const { error } = contactUsSchema.validate(MessageData);
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return { errors };
    }

    const savedEmail = await this.contactUsRepository.createEmail(MessageData);
    const mailOptions = {
      from: '"Toy Treasures" <' + process.env.SENDER_EMAIL + ">",
      to: process.env.RECIPIENT_EMAIL,
      subject: `New Mail from ${MessageData.fullName}`,
      text: `
        New contact Email from ${MessageData.fullName}:
        Name: ${MessageData.fullName}
        Email: ${MessageData.email}
        Message: ${MessageData.messageText}
      `,
    };
    await this.transporter.verify();
    const info = await this.transporter.sendMail(mailOptions);

    return {
      message: "Form submitted successfully and email sent",
      submission: savedEmail,
    };
  }

  async getAllEmails() {
    return await this.contactUsRepository.getAllEmails();
  }
}

module.exports = ContactUsController;
