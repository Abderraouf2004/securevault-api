import Joi from "joi";

export const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roleId: Joi.string().uuid().required(),
});

export const signinSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

export const RefreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

// export const UserDTOSchema = Joi.object({
//   id: Joi.string().uuid().required(),
//   email: Joi.string().email().required(),
//   role: Joi.string().valid("USER", "ADMIN").required(),
//   createdAt: Joi.date().required(),
//   updatedAt: Joi.date().required(),
// });