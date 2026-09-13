import Joi from "joi";

export const IdParamSchema = Joi.object({
    id: Joi.string().uuid().required(),
});



export const CreateDocumentSchema = Joi.object({
  title: Joi.string().max(200).required(),
  description: Joi.string().max(500).optional(),
});

export const UpdateDocumentSchema = Joi.object({
  title: Joi.string().max(200).optional(),
  description: Joi.string().max(500).optional(),
});

export const DocumentDTOSchema = Joi.object({
  id: Joi.string().uuid().required(),
  title: Joi.string().max(200).required(),
  description: Joi.string().max(500).allow(null, "").optional(),

  ownerId: Joi.string().uuid().required(),

  originalName: Joi.string().max(255).required(),
  storageKey: Joi.string().max(255).required(),
  mimeType: Joi.string().max(100).required(),
  size: Joi.number().integer().min(1).required(),

  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});