
export namespace Document {


    export interface Create {
    title: string;
    description?: string;

    originalName: string;
    storageKey: string;
    mimeType: string;
    size: number;
    } 

    export interface DTO {
    id: string;
    title: string;
    description?: string;
    ownerId: string;
    originalName:string;
    storageKey:string;
    mimeType:string;
    size:number;
    updatedAt: Date;
    createdAt: Date;
  }

   export interface Update {
    title?: string;
    description?: string;
   }

  
}