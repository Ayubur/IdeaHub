import { HttpException, HttpStatus } from '@nestjs/common';
import { UserLoginDTO, UserRegisterDTO, UserRO } from './user.dto';
import { UserEntity } from './user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(@InjectRepository(UserEntity) private userRespository:Repository<UserEntity>){}
    

    async getAll(page:number=1):Promise<UserRO[]>{
        const users = await this.userRespository.find({
                relations:['ideas','bookmarks'],
                take:15,
                skip:15*(page-1)
            });
        return users.map(user => user.toResponseObject(false));
    }


    async getUser(userId:string){
        const user = await this.userRespository.findOne({
            where:{id:userId},
            relations:['bookmarks']
        })

        return user.toResponseObject(false);
    }
    

    async login(data:UserLoginDTO):Promise<UserRO>{

        const {email, password}=data;

     //empty field check
     const allFieldsFilledIn = Object.keys(data).every((key) => !!data[key]);
     if(! allFieldsFilledIn){
        throw new HttpException("All field required to filled in",HttpStatus.BAD_REQUEST);
     }
     
        const user = await this.userRespository.findOne({where:{email}});
        if(!user || !(await user.comparePassword(password))){
            throw new HttpException("Invalid email/password",HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject();
    }

    async register(data:UserRegisterDTO):Promise<UserRO>{
        
        const {username,email,password} =data;

          //empty field check
     const allFieldsFilledIn = Object.keys(data).every((key) => !!data[key]);
     if(! allFieldsFilledIn){
        throw new HttpException("All field required to filled in",HttpStatus.BAD_REQUEST);
     }
 
     //valid email check 

    const atposition=email.indexOf("@");  
    const dotposition=email.lastIndexOf(".");  
    if (atposition<1 || dotposition<atposition+2 || dotposition+2>=email.length){  
        throw new HttpException("please enter a valid email address",HttpStatus.BAD_REQUEST);
    }
  
    
    //password check
 
    if(password.length <6){
        throw new HttpException("Password should not be less than 6 characters",HttpStatus.BAD_REQUEST);

    }

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
