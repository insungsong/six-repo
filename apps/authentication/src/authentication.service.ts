import { SixShopConfigService } from '@libs/common/config/config.service';
import { SixShopErrorCode } from '@libs/common/constant/six-shop-error-code';
import { SixShopServiceType } from '@libs/common/constant/six-shop-service-type';
import { AuthenticationInput, RegisterUserInput } from '@libs/common/dto';
import { Payload } from '@libs/common/interface';
import {
  Authentication,
  AuthenticationOutput,
  RegisterUserOutput,
  SixShopException,
} from '@libs/common/model';
import { CustomerEntity } from '@libs/database/entities';
import { CustomerRepository } from '@libs/database/respository';
import { Injectable, Logger } from '@nestjs/common';
import * as argon2 from 'argon2';
import * as dayjs from 'dayjs';
import * as jwt from 'jsonwebtoken';
import { EntityManager } from 'typeorm';

@Injectable()
export class AuthenticationService {
  private readonly logger: Logger;

  constructor(private readonly configService: SixShopConfigService) {
    this.logger = new Logger('AuthenticationService');
  }
  async createAccessToken(
    user: CustomerEntity,
    now: dayjs.Dayjs,
    exp: dayjs.Dayjs,
    service: SixShopServiceType,
  ): Promise<string> {
    const scopes: SixShopServiceType[] = [];

    if (user != null) {
      scopes.push(SixShopServiceType.USER);
    }

    return jwt.sign(
      {
        iss: 'six-shop-server.io',
        sub: 'access',
        iat: now.unix(),
        exp: exp.unix(),
        aud: user.email,
        scope: service,
        scopes: scopes,
      } as Payload,
      this.configService.jwtSecret,
    );
  }

  async createRefreshToken(
    user: CustomerEntity,
    iat: dayjs.Dayjs,
    service: SixShopServiceType,
  ): Promise<string> {
    return jwt.sign(
      {
        iss: 'six-shop.ai',
        sub: 'refresh',
        iat: iat.unix(),
        exp: iat
          .add(
            this.configService.refreshTokenExprieTimeValue,
            this.configService.refreshTokenExpireTimeUnit,
          )
          .unix(),
        aud: user.email,
        scope: service,
      } as Payload,
      this.configService.jwtSecret,
    );
  }

  async registerUser(
    input: RegisterUserInput,
    entityManager: EntityManager,
  ): Promise<RegisterUserOutput> {
    this.logger.debug(input);

    const userRepository: CustomerRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    let user: CustomerEntity = await userRepository.findRegisteredUserByEmail(
      input.email,
    );

    if (user) {
      throw new SixShopException(SixShopErrorCode.DUPLICATE_EMAIL);
    }

    user = await userRepository
      .create({
        email: input.email,
        password: await argon2.hash(input.password),
        name: input.name,
      })
      .save();

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    return {
      result: SixShopErrorCode.SUCCESS,
      data: {
        accessToken: await this.createAccessToken(
          user,
          now,
          exp,
          input.service,
        ),
        tokenType: 'Bearer',
        expiresIn: exp.unix(),
        refreshToken: await this.createRefreshToken(user, now, input.service),
      } as Authentication,
    } as AuthenticationOutput;
  }

  async authenticate(
    input: AuthenticationInput,
    entityManager: EntityManager,
  ): Promise<AuthenticationOutput> {
    this.logger.debug(input);

    const userRepository: CustomerRepository =
      entityManager.getCustomRepository<CustomerRepository>(CustomerRepository);

    const user: CustomerEntity = await userRepository.findRegisteredUserByEmail(
      input.email,
    );
    if (user == null) {
      throw new SixShopException(SixShopErrorCode.USER_NOT_FOUND);
    }

    if ((await argon2.verify(user.password, input.password)) === false) {
      throw new SixShopException(SixShopErrorCode.PASSWORD_INCORRECT);
    }

    const now = dayjs();
    const exp = now.add(
      this.configService.accessTokenExprieTimeValue,
      this.configService.accessTokenExpireTimeUnit,
    );

    return {
      result: SixShopErrorCode.SUCCESS,
      data: {
        accessToken: await this.createAccessToken(
          user,
          now,
          exp,
          input.service,
        ),
        tokenType: 'Bearer',
        expiresIn: exp.unix(),
        refreshToken: await this.createRefreshToken(user, now, input.service),
      } as Authentication,
    } as AuthenticationOutput;
  }
}
