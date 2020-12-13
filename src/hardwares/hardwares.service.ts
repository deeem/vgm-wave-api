import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateHardwareDto } from './dto/create-hardware.dto'
import { UpdateHardwareDto } from './dto/update-hardware.dto'
import { Hardware } from './entities/hardware.entity'

@Injectable()
export class HardwaresService {
  constructor(
    @InjectRepository(Hardware)
    private readonly hardwareRepository: Repository<Hardware>,
  ) {}

  create(createHardwareDto: CreateHardwareDto) {
    const hardware = this.hardwareRepository.create(createHardwareDto)

    return this.hardwareRepository.save(hardware)
  }

  findAll() {
    return this.hardwareRepository.find()
  }

  async findOne(id: number) {
    const harware = await this.hardwareRepository.findOne(id)

    if (!harware) {
      throw new NotFoundException(`Hardware #${id} not found`)
    }

    return harware
  }

  async update(id: number, updateHardwareDto: UpdateHardwareDto) {
    const hardware = await this.hardwareRepository.preload({
      id,
      ...updateHardwareDto,
    })

    if (!hardware) {
      throw new NotFoundException(`Hardware #${id} not found`)
    }

    return this.hardwareRepository.save(hardware)
  }

  async remove(id: number) {
    const hardware = await this.findOne(id)
    return this.hardwareRepository.remove(hardware)
  }
}
