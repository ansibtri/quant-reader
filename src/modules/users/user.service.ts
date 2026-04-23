import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsSelect, Repository } from 'typeorm';
import { UserRole, Users } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/hashing.utils';
import { UserAlreadyExistsException } from 'src/common/exception/user-already-exist.exception';
import { PublicUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  private logger = new Logger();
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}

  // register account
  public async registerUser(
    usersDetails: CreateUserDto,
    file: Express.Multer.File,
  ) {
    const isEmailExistAlready = await this.usersRepository.findOneBy({
      email: usersDetails.email,
    });
    if (isEmailExistAlready?.email) {
      throw new UserAlreadyExistsException(
        usersDetails.email + ' already exist!',
      );
    }

    const user = new Users();
    user.firstname = usersDetails.firstname;
    user.lastname = usersDetails.lastname;
    user.email = usersDetails.email;

    user.password = await hashPassword(usersDetails.password);

    user.phoneNumber = usersDetails.phoneNumber;
    user.dateOfBirth = usersDetails.dateOfBirth;

    user.description = usersDetails.description;

    user.profilePic = file?.originalname ?? null;

    // defaults (important)
    user.role = UserRole.GHOST;
    user.followers = [];
    user.isVerified = false;
    user.isActiveContributor = true;

    const savedUser = await this.usersRepository.save(user);
    return savedUser;
  }

  // update refresh token
  async updateRefreshToken(
    email: string,
    refreshToken: string | undefined = undefined,
  ) {
    const user = await this.usersRepository.findOne({
      where: { email },
    });

    if (!user) throw new NotFoundException(`User not found`);

    user.refreshToken = refreshToken;
    const savedInfo = await this.usersRepository.save(user);
    return savedInfo;
  }

  // get all users
  async findAll(): Promise<PublicUserDto[]> {
    try {
      return this.usersRepository.find({
        where: {
          isDeactivate: false,
        },
        select: {
          firstname: true,
          lastname: true,
          description: true,
          dateOfBirth: true,
          email: true,
          profilePic: true,
          followers: true,
        },
      });
    } catch (error) {
      throw new Error(error.msg);
    }
  }

  // get single user detail by email
  async findUser(
    condition: Partial<Pick<Users, 'id' | 'email'>>,
    columns: FindOptionsSelect<Users>,
  ): Promise<Users | null> {
    const user = await this.usersRepository.findOne({
      where: condition,
      select: columns,
    });

    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    return user;
  }

  // deactivate the id
  async toggleDeactivateUserAccount(id: string): Promise<Record<string, any>> {
    const user = await this.usersRepository.findOne({
      where: {
        email: id,
      },
    });
    if (!user) throw new NotFoundException(`User with email ${id} not found`);
    user.isDeactivate = !user.isDeactivate;
    const updateuser = await this.usersRepository.save(user);
    return {
      email: updateuser.email,
      firstname: updateuser.firstname,
      lastname: updateuser.lastname,
      isDeactivate: updateuser.isDeactivate,
      profilePic: updateuser.profilePic,
    };
  }

  // delete the account
  async delete(id: string): Promise<void> {
    const user = await this.usersRepository.softDelete({ email: id });
    if (user.affected === 0)
      throw new NotFoundException(`User with email ${id} not found`);
  }

  // restore the account
  async restoreAccount(id: string): Promise<Record<string, any>> {
    const user = await this.usersRepository.restore({ email: id });
    if (user.affected === 0)
      throw new NotFoundException(`User with email ${id} not found`);
    return user;
  }
}
