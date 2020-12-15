import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'
import { Game } from './entities/game.entity'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
  ) {}

  create(createGameDto: CreateGameDto) {
    const game = this.gameRepository.create(createGameDto)

    return this.gameRepository.save(game)
  }

  findAll() {
    return this.gameRepository.find()
  }

  async findOne(id: number) {
    const game = await this.gameRepository.findOne(id)

    if (!game) {
      throw new NotFoundException(`Game #${id} not found`)
    }

    return game
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const game = await this.gameRepository.preload({
      id,
      ...updateGameDto,
    })

    if (!game) {
      throw new NotFoundException(`Game #${id} not found`)
    }

    return this.gameRepository.save(game)
  }

  async remove(id: number) {
    const game = await this.findOne(id)
    return this.gameRepository.remove(game)
  }
}
