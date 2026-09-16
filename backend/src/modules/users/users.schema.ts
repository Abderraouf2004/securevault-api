import Joi from "joi";

export const UserDTOSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  roleName: Joi.string().valid("USER", "ADMIN").required(),
  avatar: Joi.string().allow(null).optional(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
}).options({ stripUnknown: true });

export const UserDTOSchemaUpdate = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  roleId: Joi.string().uuid().required(),
  avatar: Joi.string().allow(null).optional(),
  createdAt: Joi.date().required(),
  updatedAt: Joi.date().required(),
}).options({ stripUnknown: true });

export const UpdateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  email: Joi.string().email().optional(),
}).options({ stripUnknown: true });

export const UpdatePasswordSchema = Joi.object({
  Currentpassword: Joi.string().min(8).required(),
  Newpassword: Joi.string().min(8).required(),
}).options({ stripUnknown: true });

export const UpdateUserRoleSchema = Joi.object({
  role: Joi.string().valid("USER", "ADMIN").required(),
}).options({ stripUnknown: true });
