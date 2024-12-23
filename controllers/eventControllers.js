import { eventModel } from "../models/eventModels.js";
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

    const newEvent = await eventModel.create({
      ...value,
      user: req.auth.id,
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
        message: "No details to update",
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
