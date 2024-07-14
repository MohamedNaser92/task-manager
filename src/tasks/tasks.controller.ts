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
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CreatTaskDto } from './dtos/create_task.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { TasksService } from './tasks.service';
import { User } from 'src/users/user.entity';
import { CategoriesService } from 'src/categories/categories.service';
import { AuthGuard } from 'src/guards/auth.gaurds';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { TaskDto } from './dtos/task.dto';

@Controller('tasks')
@Serialize(TaskDto)
export class TasksController {
  constructor(
    private taskService: TasksService,
    private categoryService: CategoriesService,
  ) {}

  @Post('/create/:catgId')
  @UseGuards(AuthGuard)
  async createTask(
    @Param('catgId') catgId: string,
    @Body() body: CreatTaskDto,
    @CurrentUser() user: User,
  ) {
    const category = await this.categoryService.findOneCategory(catgId);
    if (category.user.id !== user.id) {
      throw new UnauthorizedException('You are not authorized');
    }
    return this.taskService.createTask(body, category);
  }

  @Get('')
  @UseGuards(AuthGuard)
  findAllTasks() {
    return this.taskService.findAllTasks();
  }

  @Get('/category/:categId')
  @UseGuards(AuthGuard)
  findTasksByCategory(@Param('categId') categId: string) {
    return this.taskService.findTasksByCategory(parseInt(categId));
  }

  @Get('user')
  @UseGuards(AuthGuard)
  async findTasksByUser(@CurrentUser() user: User) {
    const tasks = await this.taskService.findTasksByUser(user.id);
    if (!tasks.length) {
      throw new NotFoundException('You dont have tasks yet....');
    }
    return tasks;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateTask(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Body() body: Partial<CreatTaskDto>,
  ) {
    return this.taskService.updateTask(parseInt(id), user, body);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  removeTask(@Param('id') taskId: string, @CurrentUser() user: User) {
    return this.taskService.removeTask(parseInt(taskId), user);
  }

  @Get('/custom')
  @UseGuards(AuthGuard)
  async findCustomTasks(
    @CurrentUser() user: User,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filterByCategoryName') filterByCategoryName: string,
    @Query('filterByTaskShared') filterByTaskShared: string,
    @Query('sortBy') sortBy: string,
    @Query('order') order: 'ASC' | 'DESC' = 'ASC',
  ) {
    const shared =
      filterByTaskShared === 'true'
        ? true
        : filterByTaskShared === 'false'
          ? false
          : undefined;

    const result = await this.taskService.findCustomTasks(
      user.id,
      page,
      limit,
      filterByCategoryName,
      shared,
      sortBy,
      order,
    );
    return result;
  }
}
