import { CommentEntity } from './../comment/comment.entity';
import { UserEntity } from './../user/user.entity';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, ManyToOne, UpdateDateColumn, ManyToMany, JoinTable, OneToMany } from "typeorm";

@Entity("ideas")
export class IdeaEntity{

    @PrimaryGeneratedColumn('uuid') id:string;

    @CreateDateColumn() created:Date;

    @UpdateDateColumn() updated:Date;

    @Column("text") idea:string;

    @Column("text") description:string;

    @ManyToOne(type =>UserEntity, author => author.ideas)
    author: UserEntity;

    @OneToMany(type => CommentEntity, comments => comments.idea, {cascade:true} )
    comments:CommentEntity[]

    @ManyToMany(type => UserEntity,{cascade:true})
    @JoinTable()
    upvotes: UserEntity[]

    @ManyToMany(type => UserEntity,{cascade:true})
    @JoinTable()
    downvotes: UserEntity[];
}