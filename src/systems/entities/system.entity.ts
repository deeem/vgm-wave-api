import { Company } from 'src/companies/entities/company.entity'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'

@Entity()
export class System {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @ManyToOne(() => Company, (company) => company.systems, { cascade: true })
  company: Company
}
