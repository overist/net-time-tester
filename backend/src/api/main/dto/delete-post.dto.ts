import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class DeletePostDto {
  // session
  userId: number

  @ApiProperty({
    description: 'post id',
    example: 1
  })
  @IsNotEmpty()
  postId: number
}
