import { UserRO } from './user.dto';
import { Entity, PrimaryGeneratedColumn, CreateDateColumn, Column, BeforeInsert } from "typeorm";
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Entity("users")
export class UserEntity{

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @CreateDateColumn()
    created: Date;

    @Column('text')
    username: string;

    @Column({type:'text',unique:true})
    email:string;

    @Column('text')
    password:string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password,10);
    }

    toResponseObject(showToken:boolean=true):UserRO{
        const {id, username, email, created,token} = this;
        if(showToken){
            return { id, username,email,created,token}; 
        }
        return { id, username,email,created};
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