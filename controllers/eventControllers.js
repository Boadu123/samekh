import { eventModel } from "../models/eventModels.js";
import { userModel } from "../models/userModels.js";
import { mailTransporter } from "../utils/mail.js";
import {
  addEventValidator,
  updateEventValidator,
} from "../validators/eventValidators.js";

export const AddEvent = async (req, res, next) => {
  try {
    const { error, value } = addEventValidator.validate({
      ...req.body,
      image: req?.files?.length ? req.files.map((file) => file.filename) : [],
    });
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }
    const loginUser = await userModel.findById(req.auth.id);
    if (!loginUser) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    const newEvent = await eventModel.create({
      ...value,
      user: req.auth.id,
    });

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: loginUser.email,
      subject: "An event has been added to the Samekh website",
      text: `The ${value.title} will coming of on ${value.date} so kindly take note.`,
    });

    res.status(201).json({
      status: "success",
      message: "Event added successfully",
      details: newEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllEvents = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 200, skip = 0 } = req.query;
    const events = await eventModel
      .find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(limit)
      .skip(skip);

    return res.status(200).json({
      status: "success",
      message: "Events available",
      deatils: events,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneEvent = async (req, res, next) => {
  try {
    const event = await eventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({
        status: "error",
        message: "No Event available",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Event is available",
      details: event,
    });
  } catch (error) {
    next(error);
  }
};

export const updateEvent = async (req, res, next) => {
  try {
    const { error, value } = updateEventValidator.validate({
      ...req.body,
      image: req?.files?.length ? req.files.map((file) => file.filename) : [],
    });
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }

    const updatedEvent = await eventModel.findByIdAndUpdate(
      { user: req.auth.id, _id: req.params.id },
      value,
      { new: true }
    );

    if (!updateEvent) {
      return res.status(404).json({
        status: "error",
        message: "No Event found",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Event Updated Successfully",
      details: updatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const loginUser = await userModel.findById(req.auth.id);
    if (!loginUser) {
      return res.status(404).json({
        status: "error",
        message: "No user found",
      });
    }
    const deletedEvent = await eventModel.findByIdAndDelete({
      _id: req.params.id,
      user: req.auth.id,
    });
    if (!deletedEvent) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: loginUser.email,
      subject: "Event Deletion",
      text: `Your event ${deletedEvent.title} on ${deletedEvent.date} has been deleted. If you are not aware kindly Samekh website to retify`,
    });

    res.status(200).json({
      status: "success",
      message: "Event Deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
