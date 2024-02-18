import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, Length } from 'class-validator'

export class RemoveLikePostDto {
  // session
  userId: number

  @ApiProperty({
    description: 'post id',
    example: 1
  })
  @IsNotEmpty()
  postId: number
}
