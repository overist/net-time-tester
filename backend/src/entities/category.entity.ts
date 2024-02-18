import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('subject', ['subject'], { unique: true })
@Entity('_category', { schema: 'develop' })
export class Category {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  id: number

  @Column('int', { name: 'creater_id', comment: 'creater id' })
  createrId: number

  @Column('varchar', {
    name: 'subject',
    unique: true,
    comment: 'subject',
    length: 255
  })
  subject: string

  @Column('varchar', {
    name: 'description',
    nullable: true,
    comment: 'description',
    length: 255
  })
  description: string | null

  @Column('int', { name: 'icon_img', nullable: true, comment: 'icon img' })
  iconImg: number | null

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
