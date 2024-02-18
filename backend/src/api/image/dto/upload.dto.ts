import { ApiProperty } from '@nestjs/swagger'

export class UploadDto {
  @ApiProperty({
    description: 'note',
    example: ''
  })
  note: string
}
