import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class FollowUserDto {
  // session
  userId: number

  @ApiProperty({
    description: '팔로우할 유저의 ID',
    example: 1
  })
  @IsNotEmpty()
  followId: number
}
