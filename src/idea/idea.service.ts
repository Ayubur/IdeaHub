import { Vote } from './../shared/vote.enum';
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


    private toResponseObject(idea: IdeaEntity, hasMore:boolean=false, hasPrevious:boolean=false): IdeaRO{
        let responseObject:any = {...idea,has_more: hasMore,has_previous:hasPrevious,author: idea.author.toResponseObject(false)};
        if(responseObject.upvotes){
            responseObject.upvotes= idea.upvotes.length;
        }
        if(responseObject.downvotes){
            responseObject.downvotes= idea.downvotes.length;
        }

        return responseObject;
    }

    private checkOwnerShips(idea:IdeaEntity, userId:string){
        if( idea.author.id !== userId){
            throw new HttpException('Unauthorized',HttpStatus.UNAUTHORIZED);
        }
    }

    private async votes(idea:IdeaEntity,user:UserEntity, vote:Vote){
        const opposite = (vote === Vote.UP) ? Vote.DOWN : Vote.UP;

        if(
            idea[opposite].filter(vote => vote.id === user.id).length >0 ||
            idea[vote].filter(vote => vote.id === user.id).length >0
        ){
            idea[opposite] = idea[opposite].filter(vote => vote.id !== user.id);
            idea[vote] = idea[vote].filter(vote => vote.id !== user.id);

            await this.ideaRespository.save(idea);
        }else if(idea[vote].filter(vote => vote.id === user.id).length<1){
            
            idea[vote].push(user);
            await this.ideaRespository.save(idea);

        }else{
            throw new HttpException('Unable to cast vote', HttpStatus.BAD_REQUEST);
        }
        return idea;

    }

    async getAllIdeas(page:number=1): Promise<IdeaRO[]>{
        const size= 15;

        const totalCount= (await this.ideaRespository.find()).length;
        const totalPages = Math.ceil(totalCount / size);
        const hasMore= (totalCount <= size*page) ? false : true;

        if(page==0){
            page=1;
        }

        if(page > totalPages){
            page = totalPages;
        }
        const hasPrevious = page==1 ? false :true;

        const ideas = await this.ideaRespository.find({
                relations:['author','upvotes','downvotes','comments'],
                take:size,
                skip:size*(page-1),
                order: {created:'DESC'}
            });
        return ideas.map( idea => this.toResponseObject(idea, hasMore, hasPrevious));
    }

    async getIdea(id:string):Promise<IdeaRO>{
        const idea= await this.ideaRespository.findOne({where:{id}, relations:['author','upvotes','downvotes','comments']});
        if(! idea){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
      
        return this.toResponseObject(idea);
    }


    async saveIdea(userId:string,data:IdeaDTO):Promise<IdeaRO>{
        const allFieldsFilledIn = Object.keys(data).every((key) => !!data[key]);
        if(! allFieldsFilledIn){
            throw new HttpException("All field required to filled in",HttpStatus.BAD_REQUEST);
         }

        const user = await this.userRepository.findOne({where:{id:userId}})
        const createdIdea = await this.ideaRespository.create({...data,author:user});
        await this.ideaRespository.save(createdIdea);
          
        return this.toResponseObject(createdIdea);

    }

    async updateIdea(id:string, idea:string,description:string, userId:string){

        if(idea=='' || description==''){
            throw new HttpException("All field required to filled in",HttpStatus.BAD_REQUEST);
        }
        
        let updatedIdea = await this.ideaRespository.findOne({ where :{id},relations:['author','upvotes','downvotes','comments']});
        
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
        const idea = await this.ideaRespository.findOne({where:{id},relations:['author','upvotes','downvotes','comments']});
        if(! idea){
            throw new HttpException("Not Found", HttpStatus.NOT_FOUND);
        }
        this.checkOwnerShips(idea,userId);
        await this.ideaRespository.delete({id});
        return {"deleted": true};
    }



    async upvotes(id:string,userId:string){
       
        let idea = await this.ideaRespository.findOne({where:{id},relations:['author','upvotes','downvotes','comments']});
        const user = await this.userRepository.findOne({where:{id:userId}});
        idea= await this.votes(idea,user,Vote.UP);
        return this.toResponseObject(idea);
    }

    async downvotes(id:string,userId:string){
              
        let idea = await this.ideaRespository.findOne({where:{id},relations:['author','upvotes','downvotes','comments']});
        const user = await this.userRepository.findOne({where:{id:userId}});
        idea= await this.votes(idea,user,Vote.DOWN);
        return this.toResponseObject(idea);
    }


    async bookmark(id:string,userId:string){
        const idea= await this.ideaRespository.findOne({where:{id}});
        const user = await this.userRepository.findOne({where:{id:userId},relations:['bookmarks']});

        if(user.bookmarks.filter(bookmark => bookmark.id === idea.id).length <1){
            user.bookmarks.push(idea);
            await this.userRepository.save(user);
        }else{
            throw new HttpException('Idea already bookmarked',HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
    }

    async unbookmark(id:string,userId:string){
        const idea= await this.ideaRespository.findOne({where:{id}});
        const user = await this.userRepository.findOne({where:{id:userId},relations:['bookmarks']});

        if(user.bookmarks.filter(bookmark => bookmark.id === idea.id).length >0){
            user.bookmarks=user.bookmarks.filter(bookmark => bookmark.id !== idea.id);
            await this.userRepository.save(user);
        }else{
            throw new HttpException('No bookmark found to delete',HttpStatus.BAD_REQUEST);
        }

        return user.toResponseObject(false);
        
    }
}
