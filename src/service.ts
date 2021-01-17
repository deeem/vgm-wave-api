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
    // console.log(this.gamesService.gameRepository)

    //  TODO
    // [*] read json
    // for each entry
    // [] create system
    // [] create game
    //
    // [] unpack zip
    // [] create playlist with tracks

    // for each zip
    // create and save system -> create and save game
    // for each track:
    // create track and save track (we know game)
    // get all created tracks and create playlist

    let vgmImport = {}

    try {
      vgmImport = JSON.parse(readFileSync('./vgmrips/games.json', 'utf8'))
    } catch (e) {
      console.error(e)
    }

    // START

    // console.log(';;', vgmImport['M58']['10-Yard Fight'])

    const testFileName = vgmImport['M58']['10-Yard Fight']

    const systemName = 'M58'
    const gameName = '10-Yard Fight'

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
      const type = entry.type // 'Directory' or 'File'
      const size = entry.vars.uncompressedSize // There is also compressedSize;

      // extension = path.extname(fileName)

      // track name ^[\d]{2,3}\s([\w\s]*).vgz
      // track number ^([\d]{2,3})\s[\w\s]*.vgz

      console.log(fileName)
      // console.log(path.extname(fileName))

      // if file extension is vgz
      // grab filename without number and extension
      // copy file to some location
      // create Track

      // create Playlist with all entries Tracks
      // create Game
      // create System

      if (path.extname(fileName) === '.vgz') {
        let trackName = fileName.match(/^[\d]{2,3}\s([\w\s]*).vgz/)?.[1]
        let trackNumber = fileName.match(/^([\d]{2,3})\s[\w\s]*.vgz/)?.[1]

        console.log({ trackName, trackNumber })

        const trackUploadedFileName = `${uuidv4()}.vgz`

        entry.pipe(createWriteStream(`./uploads/${trackUploadedFileName}`))

        const track = this.trackService.trackRepository.create({
          name: trackName,
          file: trackUploadedFileName,
          games: [game],
        })

        await this.trackService.trackRepository.save(track)
      }

      // if (fileName === "this IS the file I'm looking for") {
      //   entry.pipe(createWriteStream('output/path'))
      // } else {
      //   entry.autodrain()
      // }
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
