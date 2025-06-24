import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PaginationDTO, PostDTO, PostUpdateDTO } from './dtos/post.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private postService: PostService) {}

  @Post(':id')
  async create(
    @Req() req: { user: { id: number | string } },
    @Param('id') categoryId: string,
    @Body() data: PostDTO,
  ) {
    return await this.postService.create(
      Number(req.user.id),
      Number(categoryId),
      data,
    );
  }

  @Patch(':id')
  async update(@Param('id') postId: number, @Body() data: PostUpdateDTO) {
    return await this.postService.update(Number(postId), data);
  }

  @Delete(':id')
  async delete(@Param('id') postId: number) {
    return this.postService.delete(Number(postId));
  }

  @Get()
  async getPosts(@Query() query: PaginationDTO) {
    return this.postService.getPosts(Number(query.page), Number(query.limit));
  }

  @Get('by-user')
  async getPostsByIdUser(@Req() req: { user: { id: number | string } }) {
    return this.postService.getPostsByIdUser(Number(req.user.id));
  }

  @Get(':id')
  async getPostById(@Param('id') postId: number) {
    return this.postService.getPostById(Number(postId));
  }

  @Get()
  async getPostsByCategory(@Query('categoryid') categoryId: number) {
    return await this.postService.getPostsByCategory(Number(categoryId));
  }

  //BUSCAR POST POR PAGINAÇÃO
}
