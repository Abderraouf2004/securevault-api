import {  validateObject } from "../../errors/validate-object";
import type { User } from "../../modules/auth/auth.types";
import {  UserRepo } from "./repo";
import { UserDTOSchema} from "../../modules/auth/auth.schema";
import { ApiError } from "../../errors/api-error";
import { hash } from "../../services/hash";

export const UserService = {

  signup: async (data: User.signup) => {
    const existingUser = await UserRepo.readByEmail(data.email);
    if (existingUser) {
      throw new ApiError({
        code: "CONFLICT",
        message: "Email already in use",
        details:
          "The email provided is already associated with an existing account.",
      });
    }
    const hashedPassword = await hash.hashPassword(data.password);

   const signup = await UserRepo.signup({ ...data, password: hashedPassword });
   return validateObject<User.DTO>(UserDTOSchema, signup);
  },
  signin: async (data: User.signin) => {
    const user = await UserRepo.readByEmail(data.email);
    if (!user) {
      throw new ApiError({
        code: "NOT_FOUND",
        message: "No user with this email",
        details: "The email provided does not match any user in our records.",
      });
    }
    const isPasswordValid = await hash.comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError({
        code: "BAD_REQUEST",
        message: "Invalid password",
        details: "The password provided is incorrect. Please try again.",
      });
    }

    return validateObject<User.DTO>(UserDTOSchema, user);
  },
};