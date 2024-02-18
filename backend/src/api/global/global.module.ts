import { GlobalController } from './global.controller'
import { Module } from '@nestjs/common'
import { GlobalService } from './global.service'
import { ActionService } from '../action/action.service'

@Module({
  imports: [],
  controllers: [GlobalController],
  providers: [GlobalService, ActionService]
})
export class GlobalModule {}
