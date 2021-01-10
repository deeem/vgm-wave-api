import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConsoleModule } from 'nestjs-console'

import { SystemsModule } from './systems/systems.module'
import { GamesModule } from './games/games.module'
import { PlaylistsModule } from './playlists/playlists.module'
import { TracksModule } from './tracks/tracks.module'
import { MyConsoleService } from 'src/service'

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

    ConsoleModule,

    SystemsModule,

    GamesModule,

    PlaylistsModule,

    TracksModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyConsoleService],
  exports: [MyConsoleService],
})
export class AppModule {}
