declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roleId: string;
      };

      token?: string;
    }
  }
}

export {};