import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoryDTO } from './dtos/category.dto';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() data: CategoryDTO) {
    return await this.categoryService.create(data);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() data: CategoryDTO) {
    return await this.categoryService.update(Number(id), data);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.categoryService.remove(Number(id));
  }

  @Get()
  async categorys() {
    return await this.categoryService.categories();
  }

  @Get(':slug')
  async getPostsByCategory(@Param('slug') slug: string) {
    return await this.categoryService.getPostsByCategory(slug);
  }
}
