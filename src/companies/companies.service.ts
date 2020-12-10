import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Hardware } from 'src/hardwares/entities/hardware.entity'
import { Repository } from 'typeorm'
import { CreateCompanyDto } from './dto/create-company.dto'
import { UpdateCompanyDto } from './dto/update-company.dto'
import { Company } from './entities/company.entity'

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(Hardware)
    private readonly hardwareRepository: Repository<Hardware>,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    const hardwares =
      createCompanyDto.hardwares &&
      (await Promise.all(
        createCompanyDto.hardwares.map((name) =>
          this.preloadHardwareByName(name),
        ),
      ))

    const company = this.companyRepository.create({
      ...createCompanyDto,
      hardwares,
    })

    return this.companyRepository.save(company)
  }

  findAll() {
    return this.companyRepository.find({
      relations: ['hardwares'],
    })
  }

  async findOne(id: number) {
    const company = await this.companyRepository.findOne(id, {
      relations: ['hardwares'],
    })

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`)
    }

    return company
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    const hardwares =
      updateCompanyDto.hardwares &&
      (await Promise.all(
        updateCompanyDto.hardwares.map((name) =>
          this.preloadHardwareByName(name),
        ),
      ))

    const company = await this.companyRepository.preload({
      id,
      ...updateCompanyDto,
      hardwares,
    })

    if (!company) {
      throw new NotFoundException(`Company #${id} not found`)
    }

    return this.companyRepository.save(company)
  }

  async remove(id: number) {
    const company = await this.findOne(id)
    return this.companyRepository.remove(company)
  }

  private async preloadHardwareByName(name: string): Promise<Hardware> {
    const existingHardware = await this.hardwareRepository.findOne({ name })

    if (existingHardware) {
      return existingHardware
    }

    return this.hardwareRepository.create({ name })
  }
}
