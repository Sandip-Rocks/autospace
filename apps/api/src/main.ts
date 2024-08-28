import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  const config = new DocumentBuilder()
    .setTitle('ParkPro | Sandip Das')
    .setDescription(
      `The ParkPro API description
      <h2>Click on this link to open <a href="https://studio.apollographql.com/sandbox/explorer">Apollo Graphql Playground</a> </h2>`,
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('/', app, document)
  await app.listen(3000)
}
bootstrap()
