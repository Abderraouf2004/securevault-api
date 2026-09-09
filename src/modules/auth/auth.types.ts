
export namespace User {

    export interface signin {
    email: string;
    password: string;
    } 


    export interface signup {
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
    updatedAt: Date;
    createdAt: Date;
  }

  
}