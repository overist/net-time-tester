import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GetAdminListDto {
  @ApiProperty({
    description: 'page',
    example: 1
  })
  @IsNotEmpty()
  page: number

  @ApiProperty({
    description: 'account',
    example: ''
  })
  account: string

  @ApiProperty({
    description: 'level',
    example: ''
  })
  level: string

  @ApiProperty({
    description: 'created start at',
    example: ''
  })
  createdStartAt: string

  @ApiProperty({
    description: 'created end at',
    example: ''
  })
  createdEndAt: string

  @ApiProperty({
    description: 'limit',
    example: ''
  })
  @Type(() => Number)
  limit: number
}
