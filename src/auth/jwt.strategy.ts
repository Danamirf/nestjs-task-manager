import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface';
import { User } from './user.entity';
import { UserReposity } from './user.reposity';
import * as config from 'config';

export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserReposity)
        private userReposity: UserReposity
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret')
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { username } = payload;
        const user = await this.userReposity.findOne({username});
        
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}

