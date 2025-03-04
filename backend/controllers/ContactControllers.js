const asyncHandler = require("express-async-handler");
const ContactModel = require("../models/ContactModel");
const { RepliedToContactForm } = require("../utils/helpers/mail");

const submitContactForm = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    res.status(400);
    throw new Error("Please provide all required fields.");
  }

  try {
    const contact = await ContactModel.create({
      name,
      email,
      subject,
      message,
    });

    res.status(201).json({ message: "Contact form submitted successfully", data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while submitting the contact form." });
  }
});

const getContactForm = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const contactForms = await ContactModel.findById(id);
    res.status(200).json(contactForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching contact forms." });
  }
});
const getContactForms = asyncHandler(async (req, res) => {
  try {
    const contactForms = await ContactModel.find().sort({ createdAt: -1 });

    res.status(200).json(contactForms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching contact forms." });
  }
});

const replyToContactForm = asyncHandler(async (req, res) => {
  const contactId = req.params.id;
  const { reply } = req.body;

  try {
    const contact = await ContactModel.findById(contactId);

    if (!contact) {
      res.status(404);
      throw new Error("Contact form not found.");
    }

    if (contact.replied) {
      res.status(400);
      throw new Error("This contact form has already been replied to.");
    }

    contact.replied = true;
    contact.reply = reply;
    await contact.save();
    await RepliedToContactForm({ email: contact.email, text: reply });
    res.status(200).json({ message: "Reply sent successfully", data: contact });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while sending the reply." });
  }
});

module.exports = { submitContactForm, getContactForm, getContactForms, replyToContactForm };
