import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { StroeModule } from './store/store.module';

@Module({
  imports: [AuthenticationModule, StroeModule],
})
export class ProxyModule {}
