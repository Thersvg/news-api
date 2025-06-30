import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { EditDTO, SigninDTO, SignupDTO } from './dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authservice: AuthService) {}

  @Post('signup')
  async signup(@Body() data: SignupDTO) {
    return await this.authservice.signup(data);
  }

  @Post('signin')
  async signin(@Body() data: SigninDTO) {
    return await this.authservice.signin(data);
  }

  @Get()
  async Users() {
    return await this.authservice.users();
  }

  @Patch(':id')
  async editUser(@Param('id') id: number, @Body() data: EditDTO) {
    return await this.authservice.editUser(Number(id), data);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.authservice.remove(Number(id));
  }
}
