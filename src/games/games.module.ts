import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { System } from 'src/systems/entities/system.entity'
import { Game } from './entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([System, Game])],
  controllers: [GamesController],
  providers: [GamesService],
})
export class GamesModule {}
