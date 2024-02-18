import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('_post_like', { schema: 'develop' })
export class PostLike {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  id: number

  @Column('int', { name: 'post_id', comment: 'post id' })
  postId: number

  @Column('int', { name: 'user_id', comment: 'user id' })
  userId: number

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
