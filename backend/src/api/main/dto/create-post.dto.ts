import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, Length } from 'class-validator'

export class CreatePostDto {
  // session
  userId: number

  @ApiProperty({
    description: 'category id',
    example: 1
  })
  @IsNotEmpty()
  categoryId: number

  @ApiProperty({
    description: 'net time',
    example: 60
  })
  @IsNotEmpty()
  @IsDateString()
  netTime: number

  @ApiProperty({
    description: 'content',
    example: '턱걸이 10개 푸쉬업 80개'
  })
  @Length(1, 100)
  content: string

  @ApiProperty({
    description: 'image file id',
    example: 1
  })
  fileId: number
}
