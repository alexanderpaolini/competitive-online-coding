import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async createOrUpdateUser(githubId: string, username: string, email?: string): Promise<User> {
        let user = await this.userModel.findOne({ githubId });
        if (!user) {
            user = new this.userModel({ githubId, username, email });
        } else {
            user.username = username;
            user.email = email;
        }
        return user.save();
    }

    async findByGithubId(githubId: string): Promise<User | null> {
        return this.userModel.findOne({ githubId });
    }

    async findAll(): Promise<User[]> {
        return this.userModel.find().exec();
    }

    async findOne(id: string): Promise<User> {
        return this.userModel.findById(id).exec();
    }
}
