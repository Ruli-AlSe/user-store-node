import { regularExps } from '../../../config';

export class RegisterUserDto {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(object: { [key: string]: any }): [string?, RegisterUserDto?] {
    const { name, email, password } = object;

    if (!name) return ['Missing name'];

    if (!email) return ['Missing email'];
    if (!regularExps.email.test(email)) return ['Email is not valid'];

    if (!password) return ['Email is not valid'];
    if (password.length < 6) return ['Password too short'];

    return [undefined, new RegisterUserDto(name, email, password)];
  }
}