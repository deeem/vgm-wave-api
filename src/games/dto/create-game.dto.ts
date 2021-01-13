import { IsString } from 'class-validator'

export class CreateGameDto {
  @IsString()
  readonly name: string

  @IsString({ each: true })
  readonly system: string
}
