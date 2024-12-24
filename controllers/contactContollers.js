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

