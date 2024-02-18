import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateUserDetailDto {
  @ApiProperty({
    description: 'user id',
    example: 1
  })
  @IsNotEmpty()
  id: number

  @ApiProperty({
    description: 'username',
    example: 'username'
  })
  username: string

  @ApiProperty({
    description: 'account',
    example: 'account'
  })
  account: string
}
