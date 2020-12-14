import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CompaniesModule } from './companies/companies.module'
import { HardwaresModule } from './hardwares/hardwares.module';
import { SystemsModule } from './systems/systems.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}