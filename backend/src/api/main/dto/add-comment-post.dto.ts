import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, Length } from 'class-validator'

export class AddCommentPostDto {
  // session
  userId: number

  @ApiProperty({
    description: 'post id',
    example: 1
  })
  @IsNotEmpty()
  postId: number

  @ApiProperty({
    description: 'content',
    example: 'content'
  })
  @IsNotEmpty()
  @Length(1, 100)
  content: string
}
