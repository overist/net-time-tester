import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class SendEmailCheckDto {
  @ApiProperty({
    description: 'email',
    example: ''
  })
  @IsEmail()
  email: string
}
