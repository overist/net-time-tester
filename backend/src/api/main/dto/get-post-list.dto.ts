import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class GetPostListDto {
  @ApiProperty({
    description: 'page',
    example: 1
  })
  @IsNotEmpty()
  page: number

  @ApiProperty({
    description: 'category id',
    example: 1
  })
  @IsNotEmpty()
  categoryId: number
}
