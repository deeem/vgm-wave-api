import { IsString } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly games?: number[]

  @IsString()
  readonly tracks?: number[]
}
