export namespace Secret {
  export interface Create {
    name: string;
    Value: string;
  }

  export interface Update {
    name?: string;
    Value?: string;
  }
  export interface DTO {
    id: string;
    name: string;
    Value: string;
    ownerId: string;
    updatedAt: Date;
    createdAt: Date;
  }

  export interface ListDTO {
    id: string;
    name: string;
    ownerId: string;
    updatedAt: Date;
    createdAt: Date;
  }
}
