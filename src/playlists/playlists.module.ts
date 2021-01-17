import { Module } from '@nestjs/common'
import { PlaylistsService } from './playlists.service'
import { PlaylistsController } from './playlists.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Playlist } from './entities/playlist.entity'
import { Track } from 'src/tracks/entities/track.entity'
import { Game } from 'src/games/entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Track, Game])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
