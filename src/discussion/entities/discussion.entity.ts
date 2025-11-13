import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class Discussion {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;
  @Column({ default: 1 })
  status: number;
  @ManyToOne(() => User, (user) => user.discussions)
  user: User;
}
