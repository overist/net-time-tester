import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsNotEmpty } from 'class-validator'

export class UpdateAdminProfileDto {
  @ApiProperty({
    description: 'user id',
    example: 1
  })
  @IsNotEmpty()
  id: number

  @ApiProperty({
    description: 'image id',
    example: [1]
  })
  @IsArray()
  profile: number[]
}
