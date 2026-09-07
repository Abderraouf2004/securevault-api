
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
    email: string;
    role: "USER" | "ADMIN";
    updatedAt: Date;
    createdAt: Date;
  }

  
}