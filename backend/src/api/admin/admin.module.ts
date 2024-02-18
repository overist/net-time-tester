import { AdminController } from './admin.controller'
import { Module } from '@nestjs/common'
import { AdminService } from './admin.service'
import { GlobalService } from '../global/global.service'
import { ActionService } from '../action/action.service'
import { MainService } from '../main/main.service'

@Module({
  imports: [],
  controllers: [AdminController],
  providers: [AdminService, GlobalService, ActionService, MainService]
})
export class AdminModule {}
