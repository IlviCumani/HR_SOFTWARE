import { Role } from 'src/users/schemas/user.schema';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    _id: string;
    username: string;
    role: Role;
    employID: string;
    email: string;
  };
}
