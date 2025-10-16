import { Controller, Get, Param, Body, Put, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get(':githubId')
    async getUserByGithubId(@Param('githubId') githubId: string): Promise<User | null> {
        return this.usersService.findByGithubId(githubId);
    }

    @Get()
    async getAllUsers(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Put(':id')
    async updateUser(@Param('id') id: string, @Body() body: { username?: string; email?: string }): Promise<User> {
        const user = await this.usersService.findOne(id);
        if (!user) {
            throw new NotFoundException(`User with id ${id} not found`);
        }

        if (body.username) {
            user.username = body.username;
        }
        if (body.email) {
            user.email = body.email;
        }

        return user.save();
    }
}
