import { SixShopConfigService } from '@libs/common/config/config.service';
import { Payload } from '@libs/common/interface/jwt.paylod.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: SixShopConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.jwtSecret,
    });
  }

  async validate(payload: Payload) {
    if (payload.iss != 'six-shop-server.io') return undefined;

    return { email: payload.aud, scopes: payload.scopes };
  }
}
