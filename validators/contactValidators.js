import Joi from "joi";

export const addContactValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  phone: Joi.string(),
  message: Joi.string().required(),
});
