import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfigModule } from './common/global/config.module'
import { GlobalDatabaseModule } from './common/global/database.module'
import { GlobalHttpModule } from './common/global/http.module'
import configuration from './configuration/configuration'
import { MainModule } from './api/main/main.module'
import { AuthModule } from './api/auth/auth.module'
import { AdminModule } from './api/admin/admin.module'
import { ScheduleModule } from '@nestjs/schedule'
import { GlobalModule } from './api/global/global.module'
import { ImageModule } from './api/image/image.module'
import { DashboardModule } from './api/dashboard/dashboard.module'
import { ActionModule } from './api/action/action.module'
import { LoggerMiddleware } from './common/middleware/logger.middleware'

@Module({
  imports: [
    // setting configuration
    ConfigModule.forRoot({
      load: [configuration]
    }),

    // import global module
    GlobalConfigModule,
    GlobalDatabaseModule,
    GlobalHttpModule,

    // import app module
    ActionModule,
    MainModule,
    AdminModule,
    AuthModule,
    GlobalModule,
    ImageModule,
    DashboardModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}
