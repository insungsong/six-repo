import { CMDType } from '@libs/common/constant';
import { AuthenticationInput, RegisterUserInput } from '@libs/common/dto';
import { AuthenticationOutput, RegisterUserOutput } from '@libs/common/model';
import { TransactionBlock } from '@libs/common/transaction';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AuthenticationService } from './authentication.service';

@Controller()
export class AuthenticationController {
  private readonly logger: Logger;

  constructor(private readonly authenticationService: AuthenticationService) {
    this.logger = new Logger('AuthenticationController');
  }

  @MessagePattern({ cmd: CMDType.REGISTER_USER })
  async registerUser(
    @Payload() input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    this.logger.debug(input);

    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<RegisterUserOutput> => {
        return await this.authenticationService.registerUser(
          input as RegisterUserInput,
          entityManager,
        );
      },
    );
  }

  @MessagePattern({ cmd: CMDType.AUTHENTICATE })
  async authenticate(
    @Payload() input: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    this.logger.debug(input);
    return await TransactionBlock(
      input,
      async (input, entityManager): Promise<AuthenticationOutput> => {
        return await this.authenticationService.authenticate(
          input as AuthenticationInput,
          entityManager,
        );
      },
    );
  }
}
