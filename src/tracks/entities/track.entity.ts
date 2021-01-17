import { Game } from 'src/games/entities/game.entity'
import { Playlist } from 'src/playlists/entities/playlist.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Track {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column({ nullable: true })
  type: string

  @Column()
  file: string

  @ManyToMany(() => Playlist, (playlist) => playlist.tracks)
  playlists: Playlist[]

  @ManyToMany(() => Game, (game) => game.tracks)
  @JoinTable()
  games: Game[]
}
