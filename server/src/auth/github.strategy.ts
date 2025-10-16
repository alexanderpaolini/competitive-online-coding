import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { AuthService } from './auth.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.BASE_URL}/auth/github/callback`,
            scope: ['user:email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        const user = {
            id: profile.id,
            username: profile.username,
            email: profile.emails[0].value, // Assuming the first email is used
        };
        return user; // Return user info for further processing
    }
}
