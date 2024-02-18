import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsIn, Length } from 'class-validator'
import { Match } from 'src/common/validation/match.decorator'

export class SignUpDto {
  // ** Session
  kakaoId: string

  @ApiProperty({
    description: 'account',
    example: ''
  })
  @Length(5, 20)
  account: string

  @ApiProperty({
    description: 'username',
    example: ''
  })
  @Length(2, 20)
  username: string

  @ApiProperty({
    description: 'intro',
    example: ''
  })
  @Length(0, 255)
  intro: string

  @ApiProperty({
    description: 'image file id',
    example: 1
  })
  fileId: number
}
