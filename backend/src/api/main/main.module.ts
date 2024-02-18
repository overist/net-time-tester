import { ImageService } from './../image/image.service'
import { Module } from '@nestjs/common'
import { MainController } from './main.controller'
import { MainService } from './main.service'
import { GlobalService } from '../global/global.service'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [],
  controllers: [MainController],
  providers: [MainService, GlobalService, ImageService, ConfigService]
})
export class MainModule {}
