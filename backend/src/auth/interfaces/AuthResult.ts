import { Types } from 'mongoose';
import { Role } from 'src/users/schemas/user.schema';

export type AuthResult = {
  accessToken: string;
  _id: string;
  username: string;
  role: Role;
  loginRole: Role;
  employID: Types.ObjectId;
  email: string;
};
