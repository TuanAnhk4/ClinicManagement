import { Request } from 'express';
import { User } from '@modules/users/entities';

export interface RequestWithUser extends Request {
  user: User;
}
