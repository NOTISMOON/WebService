import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
@Entity()
export class Video {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  desc: string;
  @Column()
  cover: string;
  @Column()
  duration:string
  @Column()
  category: string;
  @Column()
  url:string
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadTime: Date;
  @Column({ default: 1 })
  status: number;
}
