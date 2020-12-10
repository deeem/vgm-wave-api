import { Module } from '@nestjs/common'
import { HardwaresService } from './hardwares.service'
import { HardwaresController } from './hardwares.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Company } from 'src/companies/entities/company.entity'
import { Hardware } from './entities/hardware.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Company, Hardware])],
  controllers: [HardwaresController],
  providers: [HardwaresService],
})
export class HardwaresModule {}
