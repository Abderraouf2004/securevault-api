export namespace User {
  export interface signin {
    email: string;
    password: string;
  }

  export interface signup {
    name: string;
    email: string;
    password: string;
  }

  export interface createUser {
    name: string;
    email: string;
    password: string;
    roleId: string;
  }

  export interface DTO {
    id: string;
    name: string;
    email: string;
    roleId: string;
    roleName: string;
    avatar?: string;
    updatedAt: Date;
    createdAt: Date;
  }

  export interface UpdateProfile {
    name?: string;
    email?: string;
    avatar?: string;
  }

  export interface UpdatePassword {
    Currentpassword: string;
    Newpassword: string;
  }
}
