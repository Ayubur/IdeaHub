import { IdeaService } from './idea.service';
import { Controller, Get, Param, Post, Patch, Delete, Body } from '@nestjs/common';

@Controller('ideas')
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
    saveIdea(@Body('idea') idea:string,@Body('description') description:string){
       return this.ideaService.saveIdea(idea,description);
    }

    @Patch(":id")
    updateIdea(@Param("id") ideadId:string,@Body('idea') idea:string,@Body('description') description:string){
        return this.ideaService.updateIdea(ideadId,idea,description);

    }

    @Delete(":id")
    deleteIdea(@Param("id") ideadId:string){
        return this.ideaService.deleteIdea(ideadId);
    }
}
