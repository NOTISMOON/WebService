import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
@Entity('artical')
export class Artical {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ type: 'text' })
  content: string;
  @Column()
  category: string;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createTime: Date;
  @Column({ default: 1 })
  status: number;
  @ManyToOne(() => User, (user) => user.articals)
  user: User;
}
