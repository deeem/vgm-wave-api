import { Module } from '@nestjs/common'
import { PlaylistsService } from './playlists.service'
import { PlaylistsController } from './playlists.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Playlist } from './entities/playlist.entity'
import { Track } from 'src/tracks/entities/track.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Playlist, Track])],
  controllers: [PlaylistsController],
  providers: [PlaylistsService],
})
export class PlaylistsModule {}
