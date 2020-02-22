import { CommentDTO } from './comment.dto';
import { AuthGuard } from './../shared/auth.guard';
import { CommentService } from './comment.service';
import { Controller, Get, Param, Post, UseGuards, Body, Delete } from '@nestjs/common';
import { User } from 'src/user/user.decorator';

@Controller('api/comments')
export class CommentController {
    constructor(private commentService:CommentService){}

    @Get('idea/:id')
    getCommentsByIdea(@Param('id') ideadId:string){
        return this.commentService.getCommentByIdea(ideadId);
    }

    @Get('user/:id')
    getCommentsByUser(@Param('id') userId:string){
        return this.commentService.getCommentByUser(userId);
    }

    @Get(':id')
    getComment(@Param('id') commentId:string){
        return this.commentService.getComment(commentId);
    }

    @Post('idea/:id')
    @UseGuards(new AuthGuard())
    saveComment(@Param('id') idea:string, @User('id') user:string, @Body() data:CommentDTO){
        return this.commentService.saveComment(idea,user,data);
    }


    @Delete(':id')
    @UseGuards(new AuthGuard())
    removeComment(@Param('id') comment:string, @User('id') user:string){
        return this.commentService.deleteComment(comment,user);
    }
}
