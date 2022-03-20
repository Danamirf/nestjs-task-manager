import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user-decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query(ValidationPipe) filterDto: GetTasksFilterDto,
        @GetUser() user: User // give us entire user object
    ) : Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`)
        return this.tasksService.getTasks(filterDto, user);
   }

    @Get('/:id')
    getTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User, // give us entire user object
    ) : Promise<Task> {
        return this.tasksService.getTaskById(id, user);
    }

    @Delete('/:id')
    deleteTaskById(
        @Param('id', ParseIntPipe) id: number,
        @GetUser() user: User, // give us entire user object
    ): Promise<void> {
        return this.tasksService.deleteTaskById(id, user);
    }

    @Patch('/:id/status')
    updateTaskStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status', TaskStatusValidationPipe) status: TaskStatus,
        @GetUser() user: User, // give us entire user object
    ): Promise<Task> {
        return this.tasksService.updateTaskStatus(id, status, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    async createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User, // give us entire user object
    ): Promise <Task>  {
        this.logger.verbose(`User "${user.username}" creating a new tasks. Task: ${JSON.stringify(createTaskDto)}`)
        return this.tasksService.createTask(createTaskDto, user);
    }
}