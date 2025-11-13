import { Discussion } from 'src/discussion/entities/discussion.entity';
import { Artical } from '../../artical/entities/artical.entity';
import { Avatar } from '../../avatar/entities/avatar.entity';
import { Production } from '../../production/entities/production.entity';
import { IsEmail } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 10 })
  name: string;
  @Column()
  phoneNumber: string;
  @Column()
  passWord: string;
  @Column({ type: 'varchar', length: 255, default: '' })
  @IsEmail({}, { message: '邮箱格式不正确', each: false })
  email: string;
  @OneToOne(() => Avatar, (avater) => avater.user, { cascade: true })
  avatar: Avatar;
  @OneToMany(() => Artical, (artical) => artical.user)
  articals: Artical[];
  @OneToMany(() => Production, (production) => production.user)
  productions: Production[];
  @OneToMany(() => Discussion, (discussion) => discussion.user, {
    cascade: true,
  })
  discussions: Discussion[];
}
