import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSystemDto } from './dto/create-system.dto'
import { UpdateSystemDto } from './dto/update-system.dto'
import { System } from './entities/system.entity'

@Injectable()
export class SystemsService {
  constructor(
    @InjectRepository(System)
    private readonly systemRepository: Repository<System>,
  ) {}

  create(createSystemDto: CreateSystemDto) {
    const system = this.systemRepository.create(createSystemDto)

    return this.systemRepository.save(system)
  }

  findAll() {
    return this.systemRepository.find()
  }

  async findOne(id: number) {
    const system = await this.systemRepository.findOne(id)

    if (!system) {
      throw new NotFoundException(`System #${id} not found`)
    }

    return system
  }

  async update(id: number, updateSystemDto: UpdateSystemDto) {
    const system = await this.systemRepository.preload({
      id,
      ...updateSystemDto,
    })

    if (!system) {
      throw new NotFoundException(`System #${id} not found`)
    }

    return this.systemRepository.save(system)
  }

  async remove(id: number) {
    const system = await this.findOne(id)
    return this.systemRepository.remove(system)
  }
}
