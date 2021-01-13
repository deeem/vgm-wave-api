import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { System } from 'src/systems/entities/system.entity'
import { Repository } from 'typeorm'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'
import { Game } from './entities/game.entity'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  async create(createGameDto: CreateGameDto) {
    const system = await this.preloadSystemByName(createGameDto.system)

    const game = this.gameRepository.create({ ...createGameDto, system })

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
    const system = await this.preloadSystemByName(updateGameDto.system)
    const game = await this.gameRepository.preload({
      id,
      ...updateGameDto,
      system,
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

  private async preloadSystemByName(name: string): Promise<System> {
    const found = await this.systemRepository.findOne({ name })

    if (found) {
      return found
    }

    return this.systemRepository.create({ name })
  }
}
