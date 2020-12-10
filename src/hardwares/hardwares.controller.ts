import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { HardwaresService } from './hardwares.service';
import { CreateHardwareDto } from './dto/create-hardware.dto';
import { UpdateHardwareDto } from './dto/update-hardware.dto';

@Controller('hardwares')
export class HardwaresController {
  constructor(private readonly hardwaresService: HardwaresService) {}

  @Post()
  create(@Body() createHardwareDto: CreateHardwareDto) {
    return this.hardwaresService.create(createHardwareDto);
  }

  @Get()
  findAll() {
    return this.hardwaresService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.hardwaresService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateHardwareDto: UpdateHardwareDto) {
    return this.hardwaresService.update(+id, updateHardwareDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.hardwaresService.remove(+id);
  }
}
