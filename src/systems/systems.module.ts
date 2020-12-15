import { Module } from '@nestjs/common'
import { SystemsService } from './systems.service'
import { SystemsController } from './systems.controller'
import { System } from './entities/system.entity'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from 'src/games/entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([System, Game])],
  controllers: [SystemsController],
  providers: [SystemsService],
})
export class SystemsModule {}
