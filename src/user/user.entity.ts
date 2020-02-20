import { IdeaEntity } from './../idea/idea.entity';
import { UserRO } from './user.dto';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert, OneToMany } from "typeorm";
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

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    toResponseObject(showToken:boolean=true):UserRO{
        const {id, username, email, created,token,ideas} = this;
        let responseObject:any ={id,username, email, created};
        if(showToken){
            responseObject.token =token;
        }
        if(ideas){
           responseObject.ideas=ideas;
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