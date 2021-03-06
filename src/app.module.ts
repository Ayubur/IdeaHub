import { HttpErrorFilter } from './shared/http-error.filter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IdeaModule } from './idea/idea.module';
import { APP_FILTER } from '@nestjs/core';
import { UserModule } from './user/user.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [TypeOrmModule.forRoot(), IdeaModule, UserModule, CommentModule],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: HttpErrorFilter
  }],
})
export class AppModule {}
