import { BcryptAdapter, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {
  constructor() {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      user.password = BcryptAdapter.hash(registerUserDto.password);
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

  public async loginUser(loginUserDto: LoginUserDto) {
    const user = await UserModel.findOne({ email: loginUserDto.email });
    if (!user) throw CustomError.badRequest('Email or password incorrect');

    const matchesPassword = BcryptAdapter.compare(loginUserDto.password, user.password);
    if (!matchesPassword) throw CustomError.badRequest('Email or password incorrect');

    const { password, ...userEntity } = UserEntity.fromObject(user);

    const token = await JwtAdapter.generateToken({ id: user.id, email: user.email });
    if (!token) throw CustomError.internalServerError('Token not generated');

    return {
      user: userEntity,
      token,
    };
  }
}
