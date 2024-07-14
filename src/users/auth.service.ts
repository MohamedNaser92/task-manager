import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signup(email: string, password: string, name: string) {
    //See if this email in use
    const userisExist = await this.userService.findByEmail(email);
    if (userisExist) {
      throw new BadRequestException('Email in use');
    }

    //Hash the user password
    //? 1) Generate the salt
    const salt = randomBytes(8).toString('hex');

    //? 2) Hash the salt and password together

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    //? 3) Join the hashed result and  the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new user
    const user = await this.userService.create(email, result, name);

    // return a user
    return user;
  }

  async signin(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User Not Found, Signup');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Password is incorrect');
    }
    return user;
  }
}
