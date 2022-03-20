import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserReposity } from './user.reposity';

@Injectable()
export class AuthService {
    private logger = new Logger('AuthService')
    constructor(
        @InjectRepository(UserReposity)
        private userReposity: UserReposity,
        private jwtService: JwtService
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return await this.userReposity.signUp(authCredentialsDto);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto) : Promise<{ accessToken: string }> {
        const username = await this.userReposity.validateUserPassword(authCredentialsDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }

        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        this.logger.debug(`Generated JWT token with payload ${JSON.stringify(payload)}`)

        return { accessToken };
    }

}
