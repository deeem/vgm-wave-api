import { Game } from 'src/games/entities/game.entity'
import { Track } from 'src/tracks/entities/track.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Game, (game) => game.playlists, {
    cascade: true,
  })
  @JoinTable()
  games: Game[]

  @ManyToMany(() => Track, (track) => track.playlists, {
    cascade: true,
  })
  @JoinTable()
  tracks: Track[]
}
