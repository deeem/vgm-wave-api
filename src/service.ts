// service.ts - a nestjs provider
import { Injectable } from '@nestjs/common'
import { ConsoleService } from 'nestjs-console'
import { GamesService } from './games/games.service'
import { MyNewService } from './service.new'

@Injectable()
export class MyService {
  constructor(
    private readonly consoleService: ConsoleService,
    private readonly myNewService: MyNewService,
    private readonly gamesService: GamesService,
  ) {
    // get the root cli
    const cli = this.consoleService.getCli()

    // create a single command (See [npm commander arguments/options for more details])
    this.consoleService.createCommand(
      {
        command: 'list <directory>',
        description: 'description',
      },
      this.listContent,
      cli, // attach the command to the cli
    )

    // create a parent command container
    const groupCommand = this.consoleService.createGroupCommand(
      {
        name: 'new',
        description: 'A command to create an item',
      },
      cli, // attach the command to the root cli
    )

    // create command
    this.consoleService.createCommand(
      {
        command: 'file <name>',
        description: 'Create a file',
      },
      this.createFile,
      groupCommand, // attach the command to the group
    )

    // create an other sub command
    this.consoleService.createCommand(
      {
        command: 'directory <name>',
        description: 'Create a directory',
      },
      this.createDirectory,
      groupCommand, // attach the command to the group
    )
  }

  listContent = async (directory: string): Promise<void> => {
    console.log(`Listing files in directory ${directory}`)
    // your code...
  }

  createFile = async (name: string): Promise<void> => {
    console.log(`Creating a file named ${name}`)

    const res = await this.gamesService.findAll()

    console.log('here', res)
    // your code...
  }

  createDirectory = async (name: string): Promise<void> => {
    console.log(`Creating a directory named ${name}`)
    // your code...
  }
}
