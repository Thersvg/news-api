import { Injectable, NotFoundException } from '@nestjs/common';
import { PostDTO, PostUpdateDTO } from './dtos/post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import slugify from 'slugify';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async create(userId: number, categoryId: number, data: PostDTO) {
    const categoryExist = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExist) {
      throw new NotFoundException('Categoria inexistente');
    }

    const slug = slugify(data.title, { lower: true, strict: true });

    return await this.prismaService.post.create({
      data: {
        title: data.title,
        slug: slug,
        summary: data.summary,
        content: data.content,
        image: data.image,
        published: data.published,
        author: {
          connect: { id: userId },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    });
  }

  async update(postId: number, data: PostUpdateDTO) {
    const postExist = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!postExist) {
      throw new NotFoundException('Post inexistente');
    }

    return await this.prismaService.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        slug: data.slug,
        published: data.published,
        summary: data.summary,
        content: data.content,
        image: data.image,
      },
    });
  }

  async delete(postId: number) {
    const postExist = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!postExist) {
      throw new NotFoundException('Post inexistente');
    }
    await this.prismaService.post.delete({ where: { id: postId } });

    return { message: 'Post removido com sucesso' };
  }

  async getPosts(page: number, limit: number) {
    const [posts, total] = await Promise.all([
      this.prismaService.post.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prismaService.post.count(),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async getPostById(postId: number) {
    const postExist = await this.prismaService.post.findUnique({
      where: { id: postId },
    });

    if (!postExist) {
      throw new NotFoundException('Post inexistente');
    }

    return this.prismaService.post.findUnique({ where: { id: postId } });
  }

  async getPostsByCategory(categoryId: number) {
    const categoryExist = await this.prismaService.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExist) {
      throw new NotFoundException('Categoria inexistente');
    }

    return await this.prismaService.post.findMany({
      where: {
        category_id: categoryId,
        published: true,
      },
      include: {
        category: true,
        author: true,
      },
    });
  }

  async getPostsByIdUser(userId: number) {
    return await this.prismaService.post.findMany({
      where: {
        author_id: userId,
      },
      include: {
        category: true,
        author: true,
      },
    });
  }
}
