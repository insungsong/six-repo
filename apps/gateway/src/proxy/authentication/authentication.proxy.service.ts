import { CMDType } from '@libs/common/constant';
import { AuthenticationInput } from '@libs/common/dto/authentication.input';
import { RegisterUserInput } from '@libs/common/dto/register-user.input';
import {
  AuthenticationOutput,
  RegisterUserOutput,
  SixShopException,
} from '@libs/common/model';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class AuthenticationProxyService {
  private readonly logger: Logger;
  constructor(@Inject('AUTHENTICATION_SERVICE') private client: ClientProxy) {
    this.logger = new Logger('AuthenticationProxyService');
  }

  async authenticate(
    input: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    try {
      this.logger.debug(input);

      return await lastValueFrom(
        this.client.send<AuthenticationOutput, AuthenticationInput>(
          { cmd: CMDType.AUTHENTICATE },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }

  async registerUser(input: RegisterUserInput): Promise<RegisterUserOutput> {
    this.logger.debug(input);
    try {
      return await lastValueFrom(
        this.client.send<RegisterUserOutput>(
          { cmd: CMDType.REGISTER_USER },
          input,
        ),
      );
    } catch (error) {
      this.logger.error(error);
      throw SixShopException.processException(error);
    }
  }
}
