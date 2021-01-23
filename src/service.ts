import * as path from 'path'
import * as unzipper from 'unzipper'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync, createReadStream, createWriteStream } from 'fs'
import { Injectable } from '@nestjs/common'
import { ConsoleService } from 'nestjs-console'
import { GamesService } from './games/games.service'
import { System } from './systems/entities/system.entity'
import { TracksService } from './tracks/tracks.service'

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

  importVgmRips = async (): Promise<void> => {
    let vgmImport = {}

    try {
      vgmImport = JSON.parse(readFileSync('./vgmrips/games.json', 'utf8'))
    } catch (e) {
      console.error(e)
    }

    // START

    // console.log(';;', vgmImport['M58']['10-Yard Fight'])

    const systemName = 'M58'
    const gameName = '10-Yard Fight'
    const testFileName = vgmImport[systemName][gameName]

    const system = await this.preloadSystemByName(systemName)
    const gameA = this.gamesService.gameRepository.create({
      name: gameName,
      system,
    })
    const game = await this.gamesService.gameRepository.save(gameA)

    const zip = createReadStream(`./vgmrips/${testFileName}`).pipe(
      unzipper.Parse({ forceStream: true }),
    )
    for await (const entry of zip) {
      const fileName = entry.path

      console.log(fileName)

      if (path.extname(fileName) === '.vgz') {
        const trackName = fileName.match(/^[\d]{2,3}\s([\w\s]*).vgz/)?.[1]
        const trackNumber = fileName.match(/^([\d]{2,3})\s[\w\s]*.vgz/)?.[1]
        const trackUploadedFileName = `${uuidv4()}.vgz`

        console.log({ trackName, trackNumber, trackUploadedFileName })

        const track = await this.trackService.trackRepository.create({
          name: trackName,
          file: trackUploadedFileName,
          games: [game],
        })
        await this.trackService.trackRepository.save(track)

        // this.trackService.trackRepository.save(
        //   this.trackService.trackRepository.create({
        //     name: trackName,
        //     file: trackUploadedFileName,
        //     games: [game],
        //   }),
        // )

        await entry.pipe(
          createWriteStream(`./uploads/${trackUploadedFileName}`),
        )
      } else {
        entry.autodrain()
      }
    }

    // END
    return

    for (const systemName in vgmImport) {
      for (const gameName in vgmImport[systemName]) {
        // console.log('->', gameName, fileName)
        const fileName = vgmImport[systemName][gameName]
        // await this.gamesService.create({ name: gameName, system: systemName })
      }
    }
  }
}
