import { IsString } from 'class-validator'

export class CreateTrackDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly type?: string
}
