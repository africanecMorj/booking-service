import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { JwtTokenModule } from './jwt/jwt.module';
import { ContentTypeMiddleware } from './middleware/content-type.middleware';
import { SessionsService } from './session/sessions.service';
import { DashboardService } from './dashboard/dashboard.service';
import { DashboardModule } from './dashboard/dashboard.module';


@Module({
  imports: [
  ConfigModule.forRoot({
    isGlobal: true,
  }),

   PrismaModule,
  UsersModule,
  AuthModule,
  JwtTokenModule,
  DashboardModule,
],
  controllers: [AppController],
  providers: [
    AppService,
    SessionsService,
    DashboardService,
  ],
})
export class AppModule implements NestModule {
   configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ContentTypeMiddleware)
      .forRoutes("*");
  }
}
