
export namespace User {


    export interface signup {
    email: string;
    password: string;
    } 

    export interface DTO {
    id: string;
    email: string;
    password: string;
    role:string;
    updatedAt: Date;
    createdAt: Date;
  }

  
}