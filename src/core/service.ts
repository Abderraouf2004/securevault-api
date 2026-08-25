import {  validateObject } from "../errors/validate-object";
import type { User } from "../modules/auth/auth.types";
import {  UserRepo } from "./repo";
import { UserDTOSchema} from "../modules/auth/auth.schema";
import { ApiError } from "../errors/api-error";

export const UserService = {

  signup: async (data: User.signup) => {
   const signup = await UserRepo.signup(data);
   return validateObject<User.DTO>(UserDTOSchema, signup);
  },
};