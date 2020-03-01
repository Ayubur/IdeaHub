import { AuthGuard } from './../shared/auth.guard';
import { UserLoginDTO, UserRegisterDTO } from './user.dto';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, UseGuards, Query } from '@nestjs/common';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @Get('api/users')
    getAllUsers(@Query('page') page:number){
        return this.userService.getAll(page);
    }

    @Post('login')
    login(@Body() data:UserLoginDTO){
        return this.userService.login(data);
    }

    @Post('register')
    register(@Body() data:UserRegisterDTO){
        return this.userService.register(data);
    }


}
