import { IsString } from 'class-validator'

export class CreateTrackDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly games: number[]

  @IsString()
  readonly playlists?: number[]

  @IsString()
  readonly type?: string
}
