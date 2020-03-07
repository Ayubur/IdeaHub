import { AuthGuard } from './../shared/auth.guard';
import { IdeaDTO } from './idea.dto';
import { IdeaService } from './idea.service';
import { Controller, Get, Param, Post, Patch, Delete, Body, UseGuards, Query } from '@nestjs/common';
import { User } from 'src/user/user.decorator';

@Controller('api/ideas')
export class IdeaController {

    constructor(private ideaService :IdeaService){}

    @Get()
    getAllIdeas(@Query('page') page:number){
      return this.ideaService.getAllIdeas(page);
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

    @Post(':id/upvotes')
    @UseGuards(new AuthGuard())
    upvotes(@Param('id') id:string, @User('id') userId:string){
        return this.ideaService.upvotes(id,userId);

    }

    @Post(':id/downvotes')
    @UseGuards(new AuthGuard())
    downvotes(@Param('id') id:string, @User('id') userId:string){
        return this.ideaService.downvotes(id,userId);

    }

    @Post(':id/bookmark')
    @UseGuards(new AuthGuard())
    bookmarkIdea(@Param('id') id:string, @User('id') userId:string){
        return this.ideaService.bookmark(id,userId);
    }

    @Get(':id/checkBookmark')
    @UseGuards(new AuthGuard())
    checkBookmark(@Param('id') id:string, @User('id') userId:string){
        return this.ideaService.checkBookmark(id,userId);
    }

    @Delete(':id/unbookmark')
    @UseGuards(new AuthGuard())
    unbookmarkIdea(@Param('id') id:string, @User('id') userId:string){
        return this.ideaService.unbookmark(id,userId);
    }
}
