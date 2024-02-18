import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserIsBanDto {
  @ApiProperty({
    description: 'user id',
    example: 1
  })
  @IsNotEmpty()
  id: number

  @ApiProperty({
    description: 'isBan',
    example: 1
  })
  isBan: number
}
