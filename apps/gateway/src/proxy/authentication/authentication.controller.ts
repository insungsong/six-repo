import { AuthenticationInput, RegisterUserInput } from '@libs/common/dto';
import {
  AuthenticationOutput,
  RegisterUserOutput,
  SixShopException,
} from '@libs/common/model';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthenticationProxyService } from './authentication.proxy.service';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
  private readonly logger: Logger;
  constructor(private authenticationService: AuthenticationProxyService) {
    this.logger = new Logger('Authentication');
  }

  @ApiOperation({
    summary: '유저 등록 api',
  })
  @ApiBody({
    type: RegisterUserInput,
  })
  @ApiResponse({ type: () => RegisterUserOutput })
  @Post('registerUser')
  async registerUser(
    @Body() input: RegisterUserInput,
  ): Promise<RegisterUserOutput> {
    this.logger.debug(input);

    try {
      return await this.authenticationService.registerUser(input);
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }

  @ApiOperation({
    summary: '유저 로그인 api',
  })
  @ApiBody({
    type: AuthenticationInput,
  })
  @ApiResponse({ type: () => AuthenticationOutput })
  @Post('authenticate')
  async authenticate(
    @Body() input: AuthenticationInput,
  ): Promise<AuthenticationOutput> {
    try {
      this.logger.debug(input);
      return await this.authenticationService.authenticate({
        ...input,
      });
    } catch (error) {
      this.logger.error(error);
      return {
        result: error.response,
      };
    }
  }
}
