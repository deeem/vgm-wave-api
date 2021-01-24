import * as path from 'path'
import * as unzipper from 'unzipper'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync, createReadStream, createWriteStream } from 'fs'
import { Injectable } from '@nestjs/common'
import { ConsoleService } from 'nestjs-console'
import { GamesService } from './games/games.service'
import { System } from './systems/entities/system.entity'
import { TracksService } from './tracks/tracks.service'
import { Track } from './tracks/entities/track.entity'
import { Game } from './games/entities/game.entity'

function* vgmExportParser(path: string) {
  let vgmJson = {}
  try {
    vgmJson = JSON.parse(readFileSync(path, 'utf8'))
  } catch (e) {
    throw e
  }

  const systemNames = Object.keys(vgmJson)

  for (const systemName of systemNames) {
    const gamesList = Object.entries(vgmJson[systemName])

    for (const [gameName, fileName] of gamesList) {
      yield { systemName, gameName, fileName }
    }
  }
}

function getTrackData(fileName: string) {
  return {
    name: fileName.substring(3, fileName.length - 4),
    number: fileName.substring(0, 2),
    uploadName: `${uuidv4()}.vgz`,
  }
}

@Injectable()
export class MyConsoleService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly gamesService: GamesService,
    private readonly trackService: TracksService,
  ) {
    const cli = this.consoleService.getCli()

    this.consoleService.createCommand(
      {
        command: 'import:vgmrips',
        description: 'import vgmrips',
      },
      this.importVgmRips,
      cli,
    )
  }

  private async preloadSystemByName(name: string): Promise<System> {
    const found = await this.gamesService.systemRepository.findOne({ name })

    if (found) {
      return found
    }

    return this.gamesService.systemRepository.create({ name })
  }

  private async createTrack(
    name: string,
    file: string,
    games: Game[],
  ): Promise<Track> {
    const trackEntity = this.trackService.trackRepository.create({
      name,
      file,
      games,
    })
    const track = await this.trackService.trackRepository.save(trackEntity)

    return track
  }

  importVgmRips = async (): Promise<void> => {
    const games = vgmExportParser('./vgmrips/games.json')

    for (const gameInfo of games) {
      const system = await this.preloadSystemByName(gameInfo.systemName)

      const gameEntity = this.gamesService.gameRepository.create({
        name: gameInfo.gameName,
        system,
      })
      const game = await this.gamesService.gameRepository.save(gameEntity)

      const tracks = []

      const zip = createReadStream(`./vgmrips/${gameInfo.fileName}`).pipe(
        unzipper.Parse({ forceStream: true }),
      )
      for await (const entry of zip) {
        const fileName = entry.path

        if (path.extname(fileName) === '.vgz') {
          const trackData = getTrackData(fileName)

          this.createTrack(trackData.name, trackData.uploadName, [game])
            .then((track) => {
              tracks.push(track)
            })
            .then(() => {
              entry.pipe(createWriteStream(`./uploads/${trackData.uploadName}`))
            })
        } else {
          entry.autodrain()
        }
      }

      const playlistEntity = this.trackService.playlistRepository.create({
        name: `${game.name} OST`,
        games: [game],
        tracks: tracks,
      })

      const playlist = await this.trackService.playlistRepository.save(
        playlistEntity,
      )

      console.log('playlist', playlist.name)

      // break
    }

    // return
  }
}
