import {  validateObject } from "../../errors/validate-object";
import { User } from "../../modules/auth/auth.types";
import { UserDTOSchema } from "../../modules/users/users.schema";
import { UsersRepo } from "./repo";

export const UsersService = {

  getAll: async () => {
    const users = await UsersRepo.getAll();
    return users.map((user) => validateObject<User.DTO>(UserDTOSchema, user));
  },
  getUserById: async (id: string ) => {
    const user = await UsersRepo.getUserById(id);
    return validateObject<User.DTO>(UserDTOSchema, user);
  },
  updateUserRole: async ( id: string ,role: string ) => {
    const user = await UsersRepo.updateUserRole(id, role);
    return validateObject<User.DTO>(UserDTOSchema, user);
  },
  deleteUser: async (id: string ) => {
    const user = await UsersRepo.deleteUser(id);
    return { success: true }; 
  }

};