import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Res,
  Session,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import SWAGGER from 'src/common/constants/swagger'
import { AuthGuard } from 'src/common/guard/auth.guard'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

// ANCHOR auth controller
@ApiTags('auth')
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ANCHOR login
  @Post('login')
  @ApiOperation({
    summary: '로그인 (관리자)',
    description: '파라미터를 입력받아 로그인을 처리합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인이 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SWAGGER.BAD_REQUEST
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: '아이디 또는 비밀번호가 유효하지 않은 경우 반환'
  })
  async login(
    @Res() res: Response,
    @Body() dto: LoginDto,
    @Session() session: any
  ) {
    // login
    const result = await this.authService.login(dto)

    if (!result.result) {
      // return 403 response
      throw new HttpException(
        'The account or password is not valid.',
        HttpStatus.UNAUTHORIZED
      )
    }

    // 정보
    const type = result.data.type
    const data = result.data.data

    if (type === 'admin') {
      // 관리자 로그인 처리
      session.userId = data.id
      if (data.isSystemAdmin === 1 && data.isAdmin === 1)
        session.role = 'SYSTEM_ADMIN'
      else if (data.isSystemAdmin === 0 && data.isAdmin === 1)
        session.role = 'ADMIN'
    } else {
      // 사용자 로그인 처리
      session.userId = data.id
      session.role = 'USER'
    }

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Login Successful',
      data: null
    })
  }

  // ANCHOR get auth info
  @UseGuards(AuthGuard)
  @Get('getAuthInfo')
  @ApiOperation({
    summary: '로그인 정보 조회 (본인)',
    description: '로그인 정보를 조회합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그인 정보 조회가 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: SWAGGER.UNAUTHORIZED
  })
  async getAuthInfo(@Res() res: Response, @Session() session: any) {
    // get user id and role from session
    const userId = session.userId
    const role = session.role

    // get auth info
    const data = await this.authService.getAuthInfo(userId, role)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR logout
  @UseGuards(AuthGuard)
  @Delete('logout')
  @ApiOperation({
    summary: '로그아웃 (본인)',
    description: '세션정보를 조회하며 로그아웃 처리합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '로그아웃이 성공적인 경우 반환'
  })
  async logout(@Res() res: Response, @Session() session: any) {
    // get user id and role from session
    const userId = session.userId
    const role = session.role

    // logout
    await this.authService.logout(userId, role)

    // logout
    session.destroy()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data: null
    })
  }

  // ANCHOR update password
  @UseGuards(AuthGuard)
  @Put('updatePassword')
  @ApiOperation({
    summary: '비밀번호 변경 (본인)',
    description: '파라미터를 입력받아 비밀번호를 변경합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '비밀번호 변경이 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SWAGGER.BAD_REQUEST
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '비밀번호 변경중 오류가 발생한 경우 반환'
  })
  async updatePassword(
    @Res() res: Response,
    @Body() dto: UpdatePasswordDto,
    @Session() session: any
  ) {
    // get user id and role from session
    const userId = session.userId
    const role = session.role

    // inject session data
    dto.userId = userId
    dto.role = role

    // update password
    try {
      await this.authService.updatePassword(dto)
    } catch (err) {
      // return 500 response
      throw new HttpException(
        'An error occurred while changing the password.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'Password change is complete.',
      data: null
    })
  }
}
