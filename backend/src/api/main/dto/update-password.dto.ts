import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'
import { Match } from 'src/common/validation/match.decorator'

export class UpdatePasswordDto {
  // ** Session
  userId: number

  @ApiProperty({
    description: 'password',
    example: ''
  })
  @Length(8, 255)
  password: string

  @ApiProperty({
    description: 'confirmPassword',
    example: ''
  })
  @Match('password')
  confirmPassword: string
}
