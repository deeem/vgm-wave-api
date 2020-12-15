import { Company } from 'src/companies/entities/company.entity'
import { Game } from 'src/games/entities/game.entity'
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Company, (company) => company.systems)
  company: Company

  @OneToMany(() => Game, (game) => game.system)
  games: Game[]
}
