import { Users } from '../entity/user.entity';
import { CreateUserDto } from './create-user.dto';

export type PublicUserDto = Omit<CreateUserDto, 'password' | 'phoneNumber'> & {
  profilePic?: string;
  followers?: string[];
};

// Response Dto for findUser method
export type UserResponseDto = Omit<Users, 'password' | 'phoneNumber'>;
