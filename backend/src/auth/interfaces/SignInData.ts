import { Types } from "mongoose";
import { Role } from "src/users/schemas/user.schema";

export type SignInData = {
    _id: string;
    username: string;
    role: Role;
    loginRole: Role;
    employID: Types.ObjectId;
    email: string;
  };