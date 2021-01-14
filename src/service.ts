import * as path from 'path'
import * as unzipper from 'unzipper'
import { v4 as uuidv4 } from 'uuid'
import { readFileSync, createReadStream, createWriteStream } from 'fs'
import { Injectable } from '@nestjs/common'
import { ConsoleService } from 'nestjs-console'
import { GamesService } from './games/games.service'

@Injectable()
export class MyConsoleService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly gamesService: GamesService,
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

  importVgmRips = async (): Promise<void> => {
    console.log(this.gamesService.gameRepository)

    return

    //  TODO
    // [*] read json
    // for each entry
    // [] create system
    // [] create game
    //
    // [] unpack zip
    // [] create playlist with tracks

    let vgmImport = {}

    try {
      vgmImport = JSON.parse(readFileSync('./vgmrips/games.json', 'utf8'))
    } catch (e) {
      console.error(e)
    }

    console.log(';;', vgmImport['M58']['10-Yard Fight'])

    const testFileName = vgmImport['M58']['10-Yard Fight']

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

        entry.pipe(createWriteStream(`./uploads/${uuidv4()}.vgz`))
      }

      if (fileName === "this IS the file I'm looking for") {
        entry.pipe(createWriteStream('output/path'))
      } else {
        entry.autodrain()
      }
    }

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
