import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Index('account', ['account'], { unique: true })
@Index('kakao_id', ['kakaoId'], { unique: true })
@Entity('_user', { schema: 'develop' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', comment: 'id' })
  id: number

  @Column('varchar', {
    name: 'account',
    unique: true,
    comment: 'account',
    length: 255
  })
  account: string

  @Column('varchar', {
    name: 'intro',
    nullable: true,
    comment: 'intro',
    length: 255
  })
  intro: string | null

  @Column('varchar', { name: 'username', comment: 'username', length: 255 })
  username: string

  @Column('int', {
    name: 'profile_img',
    nullable: true,
    comment: 'profile img'
  })
  profileImg: number | null

  @Column('int', {
    name: 'is_ban',
    nullable: true,
    comment: 'ban (0: 정상, 1: 정지)',
    default: () => "'0'"
  })
  isBan: number | null

  @Column('varchar', {
    name: 'kakao_id',
    nullable: true,
    unique: true,
    comment: 'kakao id',
    length: 255
  })
  kakaoId: string | null

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
