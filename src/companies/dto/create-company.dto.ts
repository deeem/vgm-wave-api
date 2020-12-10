import { IsString } from 'class-validator'

export class CreateCompanyDto {
  @IsString()
  readonly name: string

  @IsString({ each: true })
  readonly hardwares: string[]
}
