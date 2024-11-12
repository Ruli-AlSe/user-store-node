import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      await user.save();

      const { password, ...userEntity } = UserEntity.fromObject(user);

      return {
        user: userEntity,
        token: 'token',
      };
    } catch (error) {
      throw CustomError.internalServerError(`${error}`);
    }
  }
}
