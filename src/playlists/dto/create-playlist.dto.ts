import { IsString } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  readonly name: string
}
