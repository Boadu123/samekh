import { contactModel } from "../models/contactModels.js";
import { mailTransporter } from "../utils/mail.js";
import { addContactValidator } from "../validators/contactValidators.js";

export const AddContact = async (req, res, next) => {
  try {
    const { error, value } = addContactValidator.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }

    const newEvent = await contactModel.create(value);

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: "bboaduboateng2000@gmail.com",
      subject: "Someone is Reaching out to Samekh",
      text: `${value.name} has reached out to us with the message below.
      ${value.message}`,
    });
    res.status(200).json({
        status: "success",
        message: "Message Submitted successfully"
    })
  } catch (error) {
    next(error);
  }
};

export const getAllContact = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 200, skip = 0 } = req.query;
    const contacts = await contactModel
      .find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      status: "success",
      message: "All messages are Available here",
      details: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const contact = await contactModel.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({
        status: "error",
        message: "No Message found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Message details",
      details: contact,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const deletedContact = await contactModel.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({
        status: "error",
        message: "Message not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Event Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAllContacts = async (req, res, next) => {
    try {
      const result = await contactModel.deleteMany({});
      if (result.deletedCount === 0) {
        return res.status(404).json({
          status: "error",
          message: "No Messages found to delete",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "All Messages deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
  