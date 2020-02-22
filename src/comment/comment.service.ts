import { CommentDTO } from './comment.dto';
import { UserEntity } from 'src/user/user.entity';
import { IdeaEntity } from './../idea/idea.entity';
import { Repository } from 'typeorm';
import { CommentEntity } from './comment.entity';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CommentService {
    constructor(
        @InjectRepository(CommentEntity)
        private commentRepository : Repository<CommentEntity>,

        @InjectRepository(IdeaEntity)
        private ideaRepository: Repository<IdeaEntity>,

        @InjectRepository(UserEntity)
        private userRepository:Repository<UserEntity>
    ){}


    private toReponseObject(comment:CommentEntity){
       let responseObject:any = comment;
       if(comment.author){
           responseObject.author = comment.author.toResponseObject(false);
       }

       return responseObject;
    }


    async getCommentByIdea(id:string){
        const comments:any = await this.commentRepository.find({
            where:{idea:{id}},
            relations:['idea']
        })

        return this.toReponseObject(comments);
    }

    async getCommentByUser(id:string){
        const comments:any = await this.commentRepository.find({
            where:{author:{id}},
            relations:['author']
        })

        return this.toReponseObject(comments);
    }

    async getComment(id:string){
        const comment = await this.commentRepository.findOne({where:{id},relations:['author','idea']});
        return this.toReponseObject(comment);
    }

    async saveComment(ideaId:string,userId:string,data:CommentDTO){
        const idea = await this.ideaRepository.findOne({where:{id:ideaId}});
        const user = await this.userRepository.findOne({where:{id:userId}});

        const comment = await this.commentRepository.create({
            ... data,
            idea,
            author:user
        });

        await this.commentRepository.save(comment);
        return this.toReponseObject(comment);

    }

    async deleteComment(commentId:string,userId:string){
        const comment = await this.commentRepository.findOne({where:{id:commentId},relations:['author','idea']});

        if(comment.author.id !== userId){
            throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED);
        }

        await this.commentRepository.delete(comment);
        return {"deleted":true, comment: this.toReponseObject(comment)};
    }
}
