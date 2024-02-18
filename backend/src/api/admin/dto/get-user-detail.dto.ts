import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class GetUserDetailDto {
  @ApiProperty({
    description: 'user id',
    example: 1
  })
  @IsNotEmpty()
  id: number
}
