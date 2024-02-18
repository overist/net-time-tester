import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class VerifyEmailCheckDto {
  //session
  emailCheckEmail: string

  //session
  emailCheckCode: string

  //session
  emailCheckExpire: string

  @ApiProperty({
    example: '123456',
    description: '인증번호'
  })
  code: string
}
