import { Company } from 'src/companies/entities/company.entity'
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class Hardware {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToMany(() => Company, (company) => company.hardwares)
  companies: Company[]
}
