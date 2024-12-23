import { volunteerModel } from "../models/volunteerModels.js";
import { mailTransporter } from "../utils/mail.js";
import { signUpVolunteertValidator, updateVolunteertValidator } from "../validators/volunteerValidator.js";

export const signUpVolunteer = async (req, res, next) => {
  try {
    const { error, value } = signUpVolunteertValidator.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation Error",
        deatils: error.details,
      });
    }

    const newVolunteer = await volunteerModel.create(value);
    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: value.email,
      subject: "Volunteer at Samekh",
      text: `${value.firstName} ${value.lastName} you have signed up as a volunteer to samekh foundation.`,
    });

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: "bboaduboateng2000@gmail.com",
      subject: "New Volunteer",
      text: `${value.firstName} ${value.lastName} have signed up as a volunteer to samekh foundation. 
      First Name: ${value.firstName}.
      Last Name: ${value.lastName}
      Email: ${value.email}
      Mobile Number: ${value.phone}`,
    });
    res.status(201).json({
      status: "success",
      message: "Volunteer details recieved",
      details: newVolunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllVolunteers = async (req, res, next) => {
  try {
    const { filter = "{}", sort = "{}", limit = 200, skip = 0 } = req.query;
    const volunteers = await volunteerModel
      .find(JSON.parse(filter))
      .sort(JSON.parse(sort))
      .limit(limit)
      .skip(skip);
    res.status(200).json({
      status: "success",
      message: "All Volunteers are available",
      details: volunteers,
    });
  } catch (error) {
    next(error);
  }
};

export const getOneVolunteer = async (req, res, next) => {
  try {
    const volunteer = await volunteerModel.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({
        status: "error",
        message: "No volunteer found",
      });
    }
    res.status(200).json({
      status: "success",
      message: "Volunteer details",
      details: volunteer,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteVolunteer = async (req, res, next) => {
  try {
    const deletedvolunteer = await volunteerModel.findByIdAndDelete(
      req.params.id
    );
    if (!deletedvolunteer) {
      return res.status(404).json({
        status: "error",
        message: "Volunteer not found",
      });
    }

    await mailTransporter.sendMail({
      from: "Samekh <bboaduboateng2000@gmail.com>",
      to: "bboaduboateng2000@getMaxListeners.com",
      subject: "Volunteering Redrawal",
      text: `${deletedvolunteer.firstName} ${deletedvolunteer.firstName} a volunteer has been removed.`,
    });
    res.status(200).json({
      status: "success",
      message: "Volunteer removed sucessfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateVolunteer = async (req, res, next) => {
  try {
    const { error, value } = updateVolunteertValidator.validate(req.body);
    if (error) {
      return res.status(422).json({
        status: "error",
        message: "Validation error",
        details: error.details,
      });
    }
    const updatedVolunteer = await volunteerModel.findByIdAndUpdate(
      { _id: req.params.id },
      value,
      { new: true }
    );
    if (!updatedVolunteer) {
      return res.status(404).json({
        status: "error",
        message: "Volunteer not found",
      });
    }
    res.status(200).json({
        status: "success",
        message: "Volunteer Details updated",
        details: updatedVolunteer
    })
  } catch (error) {
    next(error);
  }
};
