import { IsString } from 'class-validator'

export class CreateSystemDto {
  @IsString()
  readonly name: string
}
