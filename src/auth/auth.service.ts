import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EditDTO, SigninDTO, SignupDTO } from './dtos/auth.dto';
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

    return {
      accessToken: accessToken,
      userData: {
        name: userAlreadyExist.name,
        role: userAlreadyExist.role,
        email: userAlreadyExist.email,
      },
    };
  }

  async users() {
    return await this.prismaService.user.findMany();
  }

  async editUser(id: number, data: EditDTO) {
    const userAlreadyExist = await this.prismaService.user.findMany({
      where: {
        id: id,
      },
    });

    if (!userAlreadyExist) {
      throw new UnauthorizedException('Usuário inexistente');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return await this.prismaService.user.updateMany({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        role: data.role,
        email: data.email,
        password: hashedPassword,
      },
    });
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
