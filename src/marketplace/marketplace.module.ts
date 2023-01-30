import { Module } from '@nestjs/common';
import { MarketplaceService } from './marketplace.service';
import { DatabaseModule } from 'src/database.module';
import { marketplaceProviders } from './marketplace.provider';

@Module({
  imports: [DatabaseModule],
  providers: [MarketplaceService, ...marketplaceProviders],
  exports: [MarketplaceService],
})
export class MarketplaceModule {}
