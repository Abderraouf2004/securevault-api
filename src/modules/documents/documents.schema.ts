import Joi from "joi";

export const documentIdParamSchema = Joi.object({
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
  description: Joi.string().max(500).optional(),
  ownerId: Joi.string().uuid().required(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
});