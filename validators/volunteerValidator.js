import Joi from "joi";

export const signUpVolunteertValidator = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string(),
  skills: Joi.string()
});

export const updateVolunteertValidator = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string(),
  skills: Joi.string()
});

