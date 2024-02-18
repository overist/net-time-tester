import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, Length } from 'class-validator'

export class FindPasswordDto {
  @ApiProperty({
    description: 'account',
    example: ''
  })
  @Length(1, 255)
  account: string

  @ApiProperty({
    description: 'email',
    example: ''
  })
  @IsEmail()
  email: string
}
