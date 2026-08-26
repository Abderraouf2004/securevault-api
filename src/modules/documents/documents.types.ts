
export namespace Document {


    export interface Create {
    title: string;
    description?: string;
    } 

    export interface DTO {
    id: string;
    title: string;
    description?: string;
    ownerId: string;
    updatedAt: Date;
    createdAt: Date;
  }

   export interface Update {
    title?: string;
    description?: string;
   }

  
}