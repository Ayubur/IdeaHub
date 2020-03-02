import { UserEntity } from './../user/user.entity';
import { CommentEntity } from './../comment/comment.entity';

export class IdeaDTO{
    idea:string;
    description:string;
}

export class IdeaRO{
    id ?:string;
    created:Date;
    updated:Date;
    idea:string;
    description:string;
    has_more: boolean;
    has_previous:boolean;
    author:UserEntity;
    upvotes?: number;
    dowvotes ?: number;
    comments ?: CommentEntity[];
}