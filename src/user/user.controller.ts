import { AuthGuard } from './../shared/auth.guard';
import { UserLoginDTO, UserRegisterDTO } from './user.dto';
import { UserService } from './user.service';
import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { User } from './user.decorator';

@Controller()
export class UserController {

    constructor(private userService:UserService){}

    @Get('api/users')
    getAllUsers(@User() user){
        return this.userService.getAll();
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
