import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UnfollowUserDto {
  // session
  userId: number

  @ApiProperty({
    description: '언팔로우할 유저의 ID',
    example: 1
  })
  @IsNotEmpty()
  followId: number
}
