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
    //
  }
}
