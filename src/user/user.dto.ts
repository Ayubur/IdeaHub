export class UserLoginDTO{
    email:string;
    password:string;

}

export class UserRegisterDTO{
    username:string;
    email:string;
    password:string;
}

export class UserRO{
    id:string;
    username ?: string;
    email:string;
    created:Date;
    token ?:string;
}