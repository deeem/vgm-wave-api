import { Injectable } from '@nestjs/common'
import { Console, Command, createSpinner } from 'nestjs-console'
import { GamesService } from './games/games.service'

@Console({
  name: 'new',
  description: 'A command to create an item',
})
@Injectable()
export class MyNewService {
  constructor(private readonly gamesService: GamesService) {}

  @Command({
    command: 'file <name>',
    description: 'Create a file',
  })
  async createFile(name: string): Promise<void> {
    console.log('->', this.gamesService)
    console.log(`Creating a file named ${name}`)
    // your code...
  }

  @Command({
    command: 'directory <name>',
    description: 'Create a directory',
  })
  async createDirectory(name: string): Promise<void> {
    console.log(`Creating a directory named ${name}`)
    // your code...
  }
}
