import { AuthGuard } from './../shared/auth.guard';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards } from '@nestjs/common';
import { User } from 'src/user/user.decorator';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaService :IdeaService){}

    @Get()
    getAllIdeas(){
      return this.ideaService.getAllIdeas();
    }

    @Get(":id")
    getIdea(@Param('id') ideadId:string){
        return this.ideaService.getIdea(ideadId);
      
    }

    @Post()
    @UseGuards(new AuthGuard())
    saveIdea(@User('id') userId,@Body() data:IdeaDTO){
       return this.ideaService.saveIdea(userId,data);
    }

    @Patch(":id")
    @UseGuards(new AuthGuard())
    updateIdea(@Param("id") ideadId:string,@Body('idea') idea:string,
                @Body('description') description:string, @User('id') userId){
        return this.ideaService.updateIdea(ideadId,idea,description,userId);

    }
    
    @Delete(":id")
    @UseGuards(new AuthGuard())
    deleteIdea(@Param("id") ideadId:string,@User('id') userId){
        return this.ideaService.deleteIdea(ideadId,userId);
    }
}
