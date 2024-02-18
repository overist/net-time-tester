import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class UpdateAdminIntroDto {
  @ApiProperty({
    description: 'user id',
    example: 1
  })
  @IsNotEmpty()
  id: number

  @ApiProperty({
    description: 'intro id',
    example: 'hello'
  })
  intro: string
}
