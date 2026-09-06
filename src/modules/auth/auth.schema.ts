import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const UserDTOSchema = Joi.object({
  id: Joi.string().uuid().required(),
  email: Joi.string().email().required(),
  role: Joi.string().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});