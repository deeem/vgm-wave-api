import { Module } from '@nestjs/common'
import { TracksService } from './tracks.service'
import { TracksController } from './tracks.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Track } from './entities/track.entity'
import { Playlist } from 'src/playlists/entities/playlist.entity'
import { Game } from 'src/games/entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Track, Playlist, Game])],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TracksService],
})
export class TracksModule {}
