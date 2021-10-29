import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from "@nestjs/common";
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import JwtAuthenticationGuard from "../authentication/jwt-authentication.guard";
import { FindOneParams } from "../utils/findOneParams";

@Controller('post')
export class PostController {
  constructor(
    private readonly postService: PostService
  ) {}

  @Post()
  @UseGuards(JwtAuthenticationGuard)
  async create(@Body() post: CreatePostDto) {
    return this.postService.createPost(post);
  }

  @Get()
  findAll() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  findOne(@Param('id') { id }: FindOneParams) {
    return this.postService.getPostById(Number(id));
  }

  @Patch(':id')
  update(@Param('id') { id }: FindOneParams, @Body() post: UpdatePostDto) {
    return this.postService.updatePost(Number(id), post);
  }

  @Delete(':id')
  remove(@Param('id') { id }: FindOneParams) {
    return this.postService.deletePost(Number(id));
  }
}
