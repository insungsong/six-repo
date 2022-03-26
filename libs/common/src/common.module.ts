import { Module } from '@nestjs/common';
import { SixShopConfigModule } from './config/config.module';

@Module({
  imports: [SixShopConfigModule],
})
export class CommonModule {}
