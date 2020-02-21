import { UserRO } from './../user/user.dto';
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
    author:UserRO;
    upvotes?: number;
    dowvotes ?: number;
}