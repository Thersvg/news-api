import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class PostDTO {
  @IsNotEmpty()
  @IsString()
  title: string;
  @IsNotEmpty()
  @IsString()
  summary: string;
  @IsNotEmpty()
  @IsString()
  content: string;
  @IsNotEmpty()
  @IsBoolean()
  published?: boolean;
  @IsNotEmpty()
  @IsString()
  image: string;
}

export class PostUpdateDTO {
  @IsString()
  title: string;
  @IsString()
  slug: string;
  @IsString()
  summary: string;
  @IsString()
  content: string;
  @IsBoolean()
  published?: boolean;
  @IsString()
  image: string;
}

export class PaginationDTO {
  page: number;
  limit: number;
}
