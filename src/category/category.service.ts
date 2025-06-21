import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CategoryDTO } from './dtos/category.dto';
import { PrismaService } from '../prisma/prisma.service';
import slugify from 'slugify';
import { Category } from 'generated/prisma';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}

  async create(data: CategoryDTO): Promise<Category> {
    const categoryExist = await this.prismaService.category.findFirst({
      where: {
        name: data.name,
      },
    });

    if (categoryExist) {
      throw new UnauthorizedException('Essa categoria já existe!');
    }

    const slug = slugify(data.name, { lower: true, strict: true });

    const category = await this.prismaService.category.create({
      data: {
        name: data.name,
        description: data.description,
        slug,
      },
    });

    return category;
  }

  async update(id: number, data: CategoryDTO): Promise<Category> {
    const categoryExist = await this.prismaService.category.findFirst({
      where: {
        id: id,
      },
    });

    if (!categoryExist) {
      throw new UnauthorizedException('Essa categoria não existe');
    }

    return await this.prismaService.category.update({
      where: {
        id: id,
      },
      data: {
        name: data.name,
        slug: slugify(data.name, { lower: true, strict: true }),
        description: data.description,
      },
    });
  }

  async remove(id: number) {
    const categoryExist = await this.prismaService.category.findFirst({
      where: {
        id: id,
      },
    });

    if (!categoryExist) {
      throw new UnauthorizedException('Essa categoria não existe');
    }

    const postExistInCategory = await this.prismaService.post.findMany({
      where: {
        category_id: id,
      },
    });

    if (postExistInCategory.length > 0) {
      throw new UnauthorizedException(
        'Não é possível remover esta categoria porque existem posts vinculados a ela.',
      );
    }

    await this.prismaService.category.delete({
      where: { id: id },
    });

    return { message: 'Categoria removida com sucesso' };
  }

  async categories() {
    return await this.prismaService.category.findMany();
  }

  async getPostsByCategory(slug: string) {
    const category = await this.prismaService.category.findFirst({
      where: {
        slug: slug,
      },
    });

    if (!category) {
      throw new NotFoundException('Essa categoria não possui postagens');
    }

    return category;
  }
}
