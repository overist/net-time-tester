import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsNotEmpty, Length } from 'class-validator'

export class CreateCategoryDto {
  // session
  userId: number

  @ApiProperty({
    description: 'subject',
    example: '운동'
  })
  @Length(1, 20)
  subject: string

  @ApiProperty({
    description: 'image file id',
    example: 1
  })
  fileId: number
}
