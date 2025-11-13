import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('production')
export class Production {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  desc: string;
  @Column()
  image: string;
  @Column()
  link: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;
  @Column({ default: 1 })
  status: number;
  @ManyToOne(() => User, (user) => user.productions)
  user: User;
}
