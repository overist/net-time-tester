import { ImageService } from './../image/image.service'
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
  Res,
  Session,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common'
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { MainService } from './main.service'
import { LoginKakaoDto } from './dto/login-kakao.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { AuthGuard } from 'src/common/guard/auth.guard'
import {
  FileFieldsInterceptor,
  FileInterceptor
} from '@nestjs/platform-express'
import { VerifyEmailCheckDto } from './dto/verify-email-check.dto'
import { SendEmailCheckDto } from './dto/send-email-check.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { FindPasswordDto } from './dto/find-password.dto'
import { ApiFiles } from 'src/common/decorator/api-files.decorator'
import { CreatePostDto } from './dto/create-post.dto'
import { JoinCategoryDto } from './dto/join-category.dto'
import { CreateCategoryDto } from './dto/create-category.dto'
import { LeaveCategoryDto } from './dto/leave-category.dto'

// ANCHOR main controller
@ApiTags('main')
@Controller('api/main')
export class MainController {
  constructor(
    private mainService: MainService,
    private imageService: ImageService
  ) {}

  // ANCHOR 유저정보조회
  @Get('getUser')
  @ApiOperation({
    summary: '유저 정보 조회',
    description: '유저 정보 조회 API'
  })
  async getUser(@Res() res: Response, @Session() session: any) {
    const userId = session.userId

    const result = await this.mainService.getUser(userId)

    // 성공
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '유저 정보 조회 성공',
      data: result.data
    })
  }

  // ANCHOR 시스템 정보 조회
  @Get('getSysInfo')
  @ApiOperation({
    summary: '시스템 정보 조회',
    description: '시스템 정보 조회 API'
  })
  async getSysInfo(@Res() res: Response, @Session() session: any) {
    const userId = session.userId ?? null
    const sysInfo = await this.mainService.getSysInfo(userId)

    // 성공
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: sysInfo.message,
      data: sysInfo.data
    })
  }

  // ANCHOR 로그인 (카카오)
  @Post('loginKakao')
  @ApiOperation({
    summary: '카카오 로그인',
    description: '카카오 로그인 API'
  })
  async loginKakao(
    @Res() res: Response,
    @Body() dto: LoginKakaoDto,
    @Session() session: any
  ) {
    // 로그인
    const result = await this.mainService.loginKakao(dto)

    if (!result.result) {
      // 실패
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: result.message,
        data: null
      })
    }

    // 카카오아이디를 세션에 저장
    session.kakaoId = result.data.kakaoId

    if (result.data.user) {
      // 로그인 성공
      session.userId = result.data.user.userId

      // 응답
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.OK,
        message: result.message,
        data: null
      })
    } else {
      // 회원가입 페이지로 이동
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.PERMANENT_REDIRECT,
        message: result.message,
        data: null
      })
    }
  }

  // ANCHOR 회원가입 대상자 체크
  @Get('kakaoIdCheck')
  @ApiOperation({
    summary: '카카오 로그인 활성화 체크',
    description: '카카오 로그인 활성화 체크 API'
  })
  async kakaoIdCheck(@Res() res: Response, @Session() session: any) {
    const isKakaoLogedIn = session.kakaoId ? true : false
    const isUserLogedIn = session.userId ? true : false

    let message = ''
    if (!isKakaoLogedIn) {
      message = '카카오 로그인이 필요합니다.'
    } else if (isUserLogedIn) {
      message = '이미 로그인 되어있습니다.'
    }

    // 성공
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: message,
      data: isKakaoLogedIn && isUserLogedIn
    })
  }

  // ANCHOR 로그아웃
  @Delete('logout')
  @ApiOperation({
    summary: '로그아웃',
    description: '로그아웃 API'
  })
  async logout(@Res() res: Response, @Session() session: any) {
    // 로그아웃
    session.destroy()

    // 성공
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '로그아웃 되었습니다.',
      data: null
    })
  }

  // ANCHOR 회원가입
  @Post('signUp')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입 API'
  })
  @UseInterceptors(FileInterceptor('image'))
  async signUp(
    @Res() res: Response,
    @Body() dto: SignUpDto,
    @UploadedFile() image: any,
    @Session() session: any
  ) {
    // 세션 주입
    dto.kakaoId = session.kakaoId

    // upload profile image
    if (image) {
      const uploadResult = await this.imageService.upload(
        [image],
        'userProfile'
      )
      const fileId = uploadResult.data[0].id
      dto.fileId = fileId
    }

    // 회원가입
    const result = await this.mainService.signUp(dto)

    if (!result.result || !result.data?.userId) {
      // 실패
      res.status(HttpStatus.OK).json({
        statusCode: HttpStatus.BAD_REQUEST,
        message: result.message,
        data: null
      })
    }

    // 회원가입성공 동시에 로그인 세션 부여
    session.userId = result.data?.userId

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }

  // ANCHOR 카테고리 리스트 조회(전체)
  @Get('getAllCategoryList')
  @ApiOperation({
    summary: '전체 카테고리 조회',
    description: '전체 카테고리 조회 API'
  })
  async allCategory(@Res() res: Response) {
    // 카테고리 조회
    const result = await this.mainService.getAllCategoryList()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data
    })
  }

  // ANCHOR 카테고리 리스트 조회(내가 참여한 카테고리)
  @Get('getMyCategoryList')
  @ApiOperation({
    summary: '카테고리 조회',
    description: '카테고리 조회 API'
  })
  @UseGuards(AuthGuard)
  async category(@Res() res: Response, @Session() session: any) {
    const userId = session.userId

    // 카테고리 조회
    const result = await this.mainService.getMyCategoryList(userId)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: result.data
    })
  }

  // ANCHOR 카테고리 참여
  @Post('joinCategory')
  @ApiOperation({
    summary: '카테고리 참여',
    description: '카테고리 참여 API'
  })
  @UseGuards(AuthGuard)
  async joinCategory(
    @Res() res: Response,
    @Body() dto: JoinCategoryDto,
    @Session() session: any
  ) {
    dto.userId = session.userId

    // 카테고리 참여
    const result = await this.mainService.joinCategory(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }

  // ANCHOR 카테고리 탈퇴
  @Delete('leaveCategory')
  @ApiOperation({
    summary: '카테고리 탈퇴',
    description: '카테고리 탈퇴 API'
  })
  @UseGuards(AuthGuard)
  async leaveCategory(
    @Res() res: Response,
    @Query('categoryId') dto: LeaveCategoryDto,
    @Session() session: any
  ) {
    dto.userId = session.userId

    // 카테고리 탈퇴
    const result = await this.mainService.leaveCategory(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }

  // ANCHOR 카테고리 생성
  @UseGuards(AuthGuard)
  @Post('createCategory')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: '카테고리 생성',
    description: '카테고리 생성 API'
  })
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Res() res: Response,
    @Body() dto: CreateCategoryDto,
    @UploadedFile() image: any,
    @Session() session: any
  ) {
    dto.userId = session.userId

    // upload profile image
    if (image) {
      const uploadResult = await this.imageService.upload(
        [image],
        'categoryImage'
      )
      const fileId = uploadResult.data[0].id
      dto.fileId = fileId
    }

    // 카테고리 생성
    const result = await this.mainService.createCategory(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }
}
