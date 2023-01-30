import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { CommsModule } from './comms/comms.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [AuthModule, UsersModule, CommsModule, MarketplaceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
