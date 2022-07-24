import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Session
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { SignInDto } from './dto/sign-in.dto'
import { UserService } from 'src/app/user/user.service'
import SWAGGER from 'src/common/constants/swagger'

// ANCHOR auth controller
@ApiTags(SWAGGER.AUTH.TAG)
@Controller(SWAGGER.AUTH.URL)
export class AuthController {
  constructor(private userService: UserService) {}

  // ANCHOR Sign in API
  @ApiOperation({
    summary: SWAGGER.AUTH.SIGN_IN.SUMMARY,
    description: SWAGGER.AUTH.SIGN_IN.DESC
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: SWAGGER.AUTH.SIGN_IN.RES_200
  })
  @Post(SWAGGER.AUTH.SIGN_IN.URL)
  async signIn(
    @Res() res: Response,
    @Body() dto: SignInDto,
    @Session() session
  ) {
    // find account
    const user = await this.userService.findUserByAccount(dto.account)

    // login
    session.id = user.id

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: SWAGGER.AUTH.SIGN_IN.MSG.OK,
      data: user
    })
  }
}
