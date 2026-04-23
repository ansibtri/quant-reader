import { Blog } from 'src/modules/blogs/entities/blog.entity';
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

@Entity('Comments')
export class Comments {
  @PrimaryGeneratedColumn('uuid')
  commentId!: string;

  @Column({ type: 'text', nullable: false })
  description!: string;

  @Column({ nullable: false })
  userId!: string;

  @ManyToOne('Users', (user: Users) => user.id, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'userId' })
  author?: Users;

  @Column({ nullable: false })
  blogId!: string;

  @ManyToOne(() => Blog, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blogId' })
  blog!: Blog;

  @Column({ nullable: true })
  parentCommentId?: string;

  @ManyToOne(() => Comments, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parentCommentId' })
  parentComment?: Comments;

  @Column({ default: 0 })
  likes!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
