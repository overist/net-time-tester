import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class LeaveCategoryDto {
  // session
  userId: number

  @ApiProperty({
    example: 1,
    description: '카테고리 아이디'
  })
  categoryId: number
}
