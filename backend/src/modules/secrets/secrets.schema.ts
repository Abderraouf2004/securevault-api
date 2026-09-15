import Joi from "joi";

export const CreateSecretSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  Value: Joi.string().max(500).required(),
});

export const UpdateSecretSchema = Joi.object({
  name: Joi.string().min(3).max(30).optional(),
  Value: Joi.string().max(500).optional(),
});
export const SecretDTOSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(3).max(30).required(),
  Value: Joi.string().required(),
  ownerId: Joi.string().uuid().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});
