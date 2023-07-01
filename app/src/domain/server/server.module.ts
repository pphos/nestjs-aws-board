import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { IndexService } from './services/index.service';
import { StoreService } from './services/store.service';
import { DestroyService } from './services/destroy.service';
import { EditService } from './services/edit.service';

@Module({
  controllers: [ServerController],
  providers: [IndexService, StoreService, DestroyService, EditService],
})
export class ServerModule {}
