import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  const PORT = process.env.PORT || 3090;
  app.listen(PORT, function(){
     console.log(`Server running at port ${PORT}`);
  });
}
bootstrap();
