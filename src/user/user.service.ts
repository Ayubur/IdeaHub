import { HttpException, HttpStatus } from '@nestjs/common';
import { UserLoginDTO, UserRegisterDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRespository:Repository<UserEntity>){}
    

    async getAll():Promise<UserRO[]>{
        const users = await this.userRespository.find({ relations:['ideas']});
        return users.map(user => user.toResponseObject(false));
    }

    async login(data:UserLoginDTO):Promise<UserRO>{

        const {email, password}=data;
        const user = await this.userRespository.findOne({where:{email}});
        if(!user || !(await user.comparePassword(password))){
            throw new HttpException("Invalid email/password",HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();
    }

    async register(data:UserRegisterDTO):Promise<UserRO>{
        
        const {username,email} =data;
        let user= await this.userRespository.findOne({where:{email}});
        if(user){
            throw new HttpException("Email already taken, try another",HttpStatus.BAD_REQUEST);
        }
        user= await this.userRespository.findOne({where:{username}});
        if(user){
            throw new HttpException("Username already taken, try another",HttpStatus.BAD_REQUEST);
        } 
        user= await this.userRespository.create(data);
        await this.userRespository.save(user);
        return user.toResponseObject();
    }

}
