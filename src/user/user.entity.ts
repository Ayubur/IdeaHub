import { IdeaEntity } from './../idea/idea.entity';
import { UserRO } from './user.dto';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany, ManyToMany, JoinColumn, JoinTable } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity("users")
export class UserEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created: Date;

    @Column({ type:'text',unique:true })
    username: string;

    @Column({type:'text',unique:true})
    email:string;

    @Column('text')
    password:string;

    @OneToMany(type => IdeaEntity, idea => idea.author)
    ideas: IdeaEntity[];

    @ManyToMany(type => IdeaEntity,{cascade:true})
    @JoinTable()
    bookmarks: IdeaEntity[]

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    toResponseObject(showToken:boolean=true):UserRO{
        const {id, username, email, created} = this;
        let responseObject:any ={id,username, email, created};
        if(showToken){
            responseObject.token =this.token;
        }
        if(this.ideas){
           responseObject.ideas=this.ideas;
        }
        if(this.bookmarks){
            responseObject.bookmarks= this.bookmarks;
        }
        return responseObject;
    }

    async comparePassword(attempt:string){
        return await bcrypt.compare(attempt,this.password);

    }

    private get token(){
        const {id, username}=this;
        return jwt.sign({
            id, username
        },process.env.SECRET,{expiresIn:'7d'});
    }

}