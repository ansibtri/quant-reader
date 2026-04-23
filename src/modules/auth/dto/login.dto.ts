import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';

export type LoginUserDto = Pick<CreateUserDto, 'email' | 'password'>;
