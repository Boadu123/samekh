import Joi from "joi";

export const addEventValidator = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  date: Joi.date().iso(),
  location: Joi.string(),
  image: Joi.array().optional(),
  organizer: Joi.string().max(50),
});

export const updateEventValidator = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  date: Joi.date().iso(),
  location: Joi.string(),
  image: Joi.array().optional(),
  organizer: Joi.string().max(50),
});
