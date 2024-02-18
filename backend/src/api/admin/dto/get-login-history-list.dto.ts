import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'
import { Type } from 'class-transformer'

export class GetLoginHistoryListDto {
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
    description: 'type',
    example: ''
  })
  type: string

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
