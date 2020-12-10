import { Module } from '@nestjs/common'
import { CompaniesService } from './companies.service'
import { CompaniesController } from './companies.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from './entities/company.entity'
import { Hardware } from 'src/hardwares/entities/hardware.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Company, Hardware])],
  controllers: [CompaniesController],
  providers: [CompaniesService],
})
export class CompaniesModule {}
