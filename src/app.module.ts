import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SystemsModule } from './systems/systems.module'
import { GamesModule } from './games/games.module'
import { PlaylistsModule } from './playlists/playlists.module'
import { TracksModule } from './tracks/tracks.module'

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'pass123',
      database: 'postgres',
      autoLoadEntities: true,
      synchronize: true,
    }),

    SystemsModule,

    GamesModule,

    PlaylistsModule,

    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
