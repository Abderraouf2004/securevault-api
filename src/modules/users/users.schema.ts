import Joi from "joi";



export const UserDTOSchema = Joi.object({
  id: Joi.string().uuid().required(),
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  roleId: Joi.string().uuid().required(),
  roleName: Joi.string().optional(),
  createdAt: Joi.date().required(),
  department: Joi.string().allow(null).optional(),
}).options({ stripUnknown: true });

export const UpdateUserRoleSchema = Joi.object({
  role: Joi.string().valid("user", "admin").required(),
}).options({ stripUnknown: true });