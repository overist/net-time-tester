import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class GetUserListDto {
  @ApiProperty({
    description: 'page',
    example: 1
  })
  @IsNotEmpty()
  page: number

  @ApiProperty({
    description: 'userId',
    example: ''
  })
  userId: string

  @ApiProperty({
    description: 'account',
    example: ''
  })
  account: string

  @ApiProperty({
    description: 'username',
    example: ''
  })
  username: string

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
