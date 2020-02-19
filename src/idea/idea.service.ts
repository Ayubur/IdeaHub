import { IdeaDTO } from './idea.dto';
import { IdeaEntity } from './idea.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IdeaService {
    constructor(
        @InjectRepository(IdeaEntity) private ideaRespository: Repository<IdeaEntity>
        ){}

    async getAllIdeas(){
        return await this.ideaRespository.find();
    }

    async getIdea(id:string){
        return await this.ideaRespository.findOne({where:{id}});
    }

    async saveIdea(data:IdeaDTO){

        const createdIdea = await this.ideaRespository.create(data);
        await this.ideaRespository.save(createdIdea);

        return createdIdea;

    }

    async updateIdea(id:string, idea:string,description:string){
        var data={};

        if(idea){
            data = {idea};
        }
        
        if(description){
            data = {description};
        }
        await this.ideaRespository.update({id},data);
        return this.ideaRespository.findOne({id});
    }

    async deleteIdea(id:string){
        await this.ideaRespository.delete({id});
        return {"deleted": true};
    }
}
