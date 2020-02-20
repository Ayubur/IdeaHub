import { HttpStatus, HttpException } from '@nestjs/common';
import { IdeaDTO, IdeaRO } from './idea.dto';
import { IdeaEntity } from './idea.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/user.entity';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity)
        private ideaRespository: Repository<IdeaEntity>,

        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>

        ){}


    private toResponseObject(idea: IdeaEntity): IdeaRO{
        return {...idea, author: idea.author.toResponseObject(false)};
    }

    private checkOwnerShips(idea:IdeaEntity, userId:string){
        if( idea.author.id !== userId){
            throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED);
        }
    }

    async getAllIdeas(): Promise<IdeaRO[]>{
        const ideas = await this.ideaRespository.find({ relations:['author']});
        return ideas.map( idea => this.toResponseObject(idea));
    }

    async getIdea(id:string):Promise<IdeaRO>{
        const idea= await this.ideaRespository.findOne({where:{id}, relations:['author']});
        if(! idea){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        return this.toResponseObject(idea);
    }

    async saveIdea(userId:string,data:IdeaDTO):Promise<IdeaRO>{

        const user = await this.userRepository.findOne({where:{id:userId}})
        const createdIdea = await this.ideaRespository.create({...data,author:user});
        await this.ideaRespository.save(createdIdea);
          
        return this.toResponseObject(createdIdea);

    }

    async updateIdea(id:string, idea:string,description:string, userId:string){
        
        let updatedIdea = await this.ideaRespository.findOne({ where :{id}, relations:['author']});
        
        if(! updatedIdea){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        if(idea){
            updatedIdea.idea= idea;
        }
        if(description){
            updatedIdea.description= description;
        }

        this.checkOwnerShips(updatedIdea, userId);

        const newlyUpdatedIdea = await this.ideaRespository.create(updatedIdea);
        await this.ideaRespository.save(newlyUpdatedIdea);

        return this.toResponseObject(newlyUpdatedIdea);
    }

    async deleteIdea(id:string,userId:string){
        const idea = await this.ideaRespository.findOne({where:{id},relations:['author']});
        if(! idea){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        this.checkOwnerShips(idea,userId);
        await this.ideaRespository.delete({id});
        return {"deleted": true};
    }
}
