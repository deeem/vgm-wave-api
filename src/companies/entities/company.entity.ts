import { Hardware } from 'src/hardwares/entities/hardware.entity'
import { System } from 'src/systems/entities/system.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class Company {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Hardware, (hardware) => hardware.companies, {
    cascade: true,
  })
  @JoinTable()
  hardwares: Hardware[]

  @OneToMany(() => System, (system) => system.company, {
    cascade: true,
  })
  systems: System[]
}
