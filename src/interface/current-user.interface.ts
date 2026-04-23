import { UserRole } from 'src/modules/users/entity/user.entity';

export interface ICurrentUser {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isDeactivate: boolean;
}
