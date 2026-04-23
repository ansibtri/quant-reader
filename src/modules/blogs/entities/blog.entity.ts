import { Users } from 'src/modules/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Blogs')
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  blogId!: string;

  @Column('varchar', { length: 500 })
  title!: string;

  @Column('text', { unique: true })
  slug!: string;

  @Column('text')
  content!: string;

  @Column('text')
  excerpt!: string;

  @Column('varchar', { nullable: true })
  coverImage!: string;

  @Column({ type: 'text', array: true, default: [] })
  tags!: string[];

  @Column({ nullable: false })
  authorId!: string;

  @ManyToOne('Users', (author: Users) => author.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'authorId' })
  author?: Users;

  // this must be assign foreign key
  @Column({})
  category!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ nullable: true })
  publishedAt!: string;

  @Column('varchar', { nullable: true })
  readingTime?: string;

  @DeleteDateColumn()
  deletedAt?: Date;
}
