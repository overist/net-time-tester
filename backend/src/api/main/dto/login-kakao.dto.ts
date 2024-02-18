import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty } from 'class-validator'

export class LoginKakaoDto {
  @ApiProperty({
    example: 'kakao code',
    description: 'kakao code'
  })
  @IsNotEmpty()
  code: string
}
