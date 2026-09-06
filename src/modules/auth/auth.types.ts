
export namespace User {

    export interface signin {
    email: string;
    password: string;
    } 


    export interface signup {
    email: string;
    password: string;
    role: string;
    } 

    export interface DTO {
    id: string;
    email: string;
    role:string;
    updatedAt: Date;
    createdAt: Date;
  }

  
}