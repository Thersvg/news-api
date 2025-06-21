import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SigninDTO, SignupDTO } from './dtos/auth.dto';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(data: SignupDTO) {
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (userAlreadyExist) {
      throw new UnauthorizedException('Usuário já existe');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prismaService.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
    };
  }

  async signin(data: SigninDTO) {
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (!userAlreadyExist) {
      throw new UnauthorizedException('Credênciais inválidas');
    }

    const passwordIsValid = await bcrypt.compare(
      data.password,
      userAlreadyExist.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Credênciais inválidas');
    }

    const accessToken = await this.jwtService.signAsync({
      id: userAlreadyExist.id,
      name: userAlreadyExist.name,
      role: userAlreadyExist.role,
      email: userAlreadyExist.email,
    });

    return { accessToken: accessToken };
  }

  async remove(id: number) {
    const userAlreadyExist = await this.prismaService.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!userAlreadyExist) {
      throw new UnauthorizedException('ID inválido');
    }

    await this.prismaService.user.delete({
      where: {
        id: id,
      },
    });

    return { message: 'Remoção concluída com sucesso.' };
  }
}
