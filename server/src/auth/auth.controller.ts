import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { GithubStrategy } from './github.strategy';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { GithubAuthGuard } from './github-auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Get('github')
    @UseGuards(GithubAuthGuard) // Redirects to GitHub for authentication
    githubLogin() {
        // Initiates GitHub OAuth
    }

    @Get('github/callback')
    @UseGuards(GithubAuthGuard) // Handles GitHub callback
    async githubLoginCallback(@Req() req, @Res() res) {
        const user = req.user; // User object from GitHub
        const token = await this.authService.login(user); // Generate JWT
        res.cookie('access_token', token.access_token, { httpOnly: true }); // Set cookie
        res.redirect(process.env.BASE_URL); // Redirect to the front end
    }

    @Get('hello')
    @UseGuards(JwtAuthGuard) // Protect this route
    getHello(@Req() req): string {
        return `Hello, ${req.user.username}!`; // Greet the user
    }

    @Get('public-hello')
    getPublicHello(@Req() req): string {
        return 'This, this is public!'
    }
}
