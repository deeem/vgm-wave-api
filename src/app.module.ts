import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CompaniesModule } from './companies/companies.module'
import { HardwaresModule } from './hardwares/hardwares.module';
import { SystemsModule } from './systems/systems.module';
import { GamesModule } from './games/games.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),

    CompaniesModule,

    HardwaresModule,

    SystemsModule,

    GamesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
