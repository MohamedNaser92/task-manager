import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthGuard } from 'src/guards/auth.gaurds';
import { signinUserDto } from './dtos/signin-user.dto';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto) // To hide some data as password
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(
      body.email,
      body.password,
      body.name,
    );
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: signinUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('/whoissigning')
  // whoIsSigning(@Session() session: any) {
  //   return this.userService.findOne(session.userId);
  // }
  @Get('/whoissigning')
  @UseGuards(AuthGuard)
  whoIsSigning(@CurrentUser() user: string) {
    return user;
  }

  @Post('/signout')
  signout(@Session() Session: any) {
    Session.userId = null;
  }

  @Get('/allusers')
  findAllUser() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User does not exist ');
    }
    return user;
  }

  @Get()
  async findUsersByEmail(@Query('email') email: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('Email is not exist');
    }
    return user;
  }

  @Delete('/:id')
  removeUser(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Session() Session: any,
  ) {
    if (user.id !== parseInt(id)) {
      throw new UnauthorizedException(
        `You Not authriezed to delete this account`,
      );
    }
    this.userService.remove(parseInt(id));
    Session.userId = null;
  }

  @Patch('/:id')
  updateUser(
    @Param('id') id: string,
    @Body() body: UpdateUserDto,
    @CurrentUser() user: User,
  ) {
    if (user.id !== parseInt(id)) {
      throw new UnauthorizedException(
        `You Not authriezed to update this account`,
      );
    }
    return this.userService.update(parseInt(id), body);
  }
}
