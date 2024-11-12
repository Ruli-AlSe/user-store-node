import { BcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
  constructor(private readonly emailService: EmailService) {}

  public async registerUser(registerUserDto: RegisterUserDto) {
    const existUser = await UserModel.findOne({ email: registerUserDto.email });

    if (existUser) throw CustomError.badRequest('Email already exists');

    try {
      const user = new UserModel(registerUserDto);
      user.password = BcryptAdapter.hash(registerUserDto.password);
      await user.save();

      await this.sendEmailValidationLink(user.email);

      const { password, ...userEntity } = UserEntity.fromObject(user);

      const token = await JwtAdapter.generateToken({ id: user.id });
      if (!token) throw CustomError.internalServerError('Token not generated');

      return {
        user: userEntity,
        token,
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

  private async sendEmailValidationLink(email: string) {
    const token = await JwtAdapter.generateToken({ email });
    if (!token) throw CustomError.internalServerError('Error generating token');

    const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
    const htmlBody = `
    <h1>Email validation link</h1>
    <p>Click on the following link to validate your email</p>
    <a href="${link}">Validate your email: ${email}</a>
    `;
    const options = {
      emailTo: email,
      subject: 'Validate your email',
      htmlBody,
    };

    const isSent = await this.emailService.sendEmail(options);

    if (!isSent) throw CustomError.internalServerError('Error sending email');

    return true;
  }

  public async validateEmail(token: string) {
    const payload = await JwtAdapter.validateToken(token);
    if (!payload) throw CustomError.unauthorized('Invalid token');

    const { email } = payload as { email: string };
    if (!email) throw CustomError.internalServerError('Email not in token');

    const user = await UserModel.findOne({ email });
    if (!user) throw CustomError.internalServerError('User not exists');

    user.emailValidated = true;
    await user.save();

    return true;
  }
}
