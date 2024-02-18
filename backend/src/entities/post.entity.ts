import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('_post', { schema: 'develop' })
export class Post {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  id: number

  @Column('int', { name: 'category_id', comment: 'category id' })
  categoryId: number

  @Column('int', { name: 'user_id', comment: 'user id' })
  userId: number

  @Column('int', { name: 'net_time', comment: 'net time' })
  netTime: number

  @Column('int', { name: 'image', nullable: true, comment: 'image' })
  image: number | null

  @Column('text', { name: 'content', nullable: true, comment: 'content' })
  content: string | null

  @Column('datetime', {
    name: 'created_at',
    nullable: true,
    comment: 'create time',
    default: () => 'CURRENT_TIMESTAMP'
  })
  createdAt: string | Date | null

  @Column('datetime', {
    name: 'updated_at',
    nullable: true,
    comment: 'update time'
  })
  updatedAt: string | Date | null

  @Column('datetime', {
    name: 'deleted_at',
    nullable: true,
    comment: 'delete time'
  })
  deletedAt: string | Date | null
}
