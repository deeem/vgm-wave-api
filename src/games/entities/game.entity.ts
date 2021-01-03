import { Playlist } from 'src/playlists/entities/playlist.entity'
import { System } from 'src/systems/entities/system.entity'
import { Track } from 'src/tracks/entities/track.entity'
import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column('simple-array', { nullable: true })
  images: string[]

  @ManyToOne(() => System, (system) => system.games)
  system: System

  @ManyToMany(() => Playlist, (playlist) => playlist.games)
  playlists: Playlist[]

  @ManyToMany(() => Track, (track) => track.games)
  tracks: Track[]
}
