import { CommentEntity } from './../comment/comment.entity';
import { IdeaEntity } from './idea.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { IdeaController } from './idea.controller';
import { IdeaService } from './idea.service';
import { UserEntity } from 'src/user/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([IdeaEntity, UserEntity, CommentEntity])],
  controllers: [IdeaController],
  providers: [IdeaService]
})
export class IdeaModule {}
