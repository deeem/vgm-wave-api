import { Hardware } from 'src/hardwares/entities/hardware.entity'
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
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
}
