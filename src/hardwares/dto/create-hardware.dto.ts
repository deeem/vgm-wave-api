import { IsString } from 'class-validator'

export class CreateHardwareDto {
  @IsString()
  readonly name: string
}
