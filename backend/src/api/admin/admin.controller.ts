import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto'
import { DeleteAdminDto } from './dto/delete-admin.dto'
import { CreateSystemAdminDto } from './dto/create-system-admin.dto'
import { AdminService } from './admin.service'
import {
  Body,
  Query,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  Session,
  Res,
  HttpException,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import SWAGGER from 'src/common/constants/swagger'
import { GetAdminListDto } from './dto/get-admin-list.dto'
import { SystemAdminGuard } from 'src/common/guard/system-admin.guard'
import { GetAdminDetailDto } from './dto/get-admin-detail.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { UpdateAdminUsernameDto } from './dto/update-admin-username.dto'
import { UpdateAdminLevelDto } from './dto/update-admin-level.dto'
import { UpdateAdminProfileDto } from './dto/update-admin-profile.dto'
import { GetLoginHistoryListDto } from './dto/get-login-history-list.dto'
import { ApiFiles } from 'src/common/decorator/api-files.decorator'
import { UpdateAdminIntroDto } from './dto/update-admin-intro.dto'
import { GetUserListDto } from './dto/get-user-list.dto'
import { GetUserDetailDto } from './dto/get-user-detail.dto'
import { UpdateUserDetailDto } from './dto/update-user-detail.dto'
import { DeleteUserDto } from './dto/delete-user.dto'
import { ActionService } from '../action/action.service'
import { UpdateUserIsBanDto } from './dto/update-user-is-ban.dto'

// ANCHOR admin controller
@ApiTags('admin')
@Controller('api/admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private actionService: ActionService
  ) {}

  // ANCHOR check system admin
  @Get('checkSystemAdmin')
  @ApiOperation({
    summary: '시스템 관리자 존재 여부 확인 (초기)',
    description:
      '시스템 관리자가 존재하지 않는 경우 true, 시스템 관리자가 존재하는 경우 false를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '시스템 관리자 확인이 성공적인 경우 반환'
  })
  async checkSystemAdmin(@Res() res: Response) {
    // check admin
    const data = await this.adminService.checkSystemAdmin()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data: data
    })
  }

  // ANCHOR create system admin
  @Post('createSystemAdmin')
  @ApiOperation({
    summary: '시스템 관리자 생성 (초기)',
    description: '파라미터를 입력받아 시스템 관리자를 생성합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '시스템 관리자 생성이 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SWAGGER.BAD_REQUEST
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: '시스템 관리자가 존재하는 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: '시스템 관리자 생성중 오류가 발생한 경우 반환'
  })
  async createSystemAdmin(
    @Res() res: Response,
    @Body() dto: CreateSystemAdminDto
  ) {
    // check admin
    const data = await this.adminService.checkSystemAdmin()

    if (!data) {
      // return 403 response
      throw new HttpException('관리자가 이미 존재합니다.', HttpStatus.FORBIDDEN)
    }

    // create admin
    try {
      await this.adminService.createSystemAdmin(dto)
    } catch (err) {
      // return 500 response
      throw new HttpException(
        '관리자 생성 중 오류가 발생하였습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '관리자 생성이 완료되었습니다.',
      data: null
    })
  }

  // ANCHOR get admin list
  @UseGuards(SystemAdminGuard)
  @Get('getAdminList')
  @ApiOperation({
    summary: '관리자 리스트 조회 (시스템 관리자 기능)',
    description: '세션이 유효한 경우 관리자 리스트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '관리자 리스트 조회가 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: SWAGGER.UNAUTHORIZED
  })
  async getAdminList(@Res() res: Response, @Query() dto: GetAdminListDto) {
    // get admin
    const adminList = await this.adminService.getAdminList(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data: adminList
    })
  }

  // ANCHOR get admin detail
  @UseGuards(SystemAdminGuard)
  @Get('getAdminDetail')
  @ApiOperation({
    summary: '관리자 상세정보 조회 (시스템 관리자 기능)',
    description: '관리자 상세정보를 조회합니다.'
  })
  async getAdminDetail(@Res() res: Response, @Query() dto: GetAdminDetailDto) {
    // get admin detail
    const admin = await this.adminService.getAdminDetail(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data: admin
    })
  }

  // ANCHOR create admin
  @UseGuards(SystemAdminGuard)
  @Post('createAdmin')
  @ApiFiles()
  @ApiOperation({
    summary: '관리자 생성 (시스템 관리자 기능)',
    description: '관리자를 생성합니다'
  })
  async createAdmin(
    @Res() res: Response,
    @Body() dto: CreateAdminDto,
    @Session() session: any
  ) {
    // get admin by account
    const admin = await this.adminService.getAdminByAccount(dto.account)

    if (admin) {
      // return 400 response
      throw new HttpException(
        'Administrator already exists.',
        HttpStatus.BAD_REQUEST
      )
    }

    // create admin
    await this.adminService.createAdmin(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(session.userId, 'createAdmin', dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '관리자가 성공적으로 생성되었습니다.',
      data: null
    })
  }

  // ANCHOR delete admin
  @UseGuards(SystemAdminGuard)
  @Delete('deleteAdmin')
  @ApiOperation({
    summary: '관리자 삭제 (시스템 관리자 기능)',
    description: '관리자를 삭제합니다.'
  })
  async deleteAdmin(
    @Res() res: Response,
    @Query() dto: DeleteAdminDto,
    @Session() session: any
  ) {
    // delete admin
    await this.adminService.deleteAdmin(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(session.userId, 'deleteAdmin', dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '관리자가 성공적으로 삭제되었습니다.',
      data: null
    })
  }

  // ANCHOR update admin password
  @UseGuards(SystemAdminGuard)
  @Put('updateAdminPassword')
  @ApiOperation({
    summary: '관리자 비밀번호 변경 (시스템 관리자 기능)',
    description: '관리자를 비밀번호를 변경합니다.'
  })
  async updateAdminPassword(
    @Res() res: Response,
    @Body() dto: UpdateAdminPasswordDto,
    @Session() session: any
  ) {
    // update admin password
    await this.adminService.updateAdminPassword(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateAdminPassword',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '비밀번호 변경에 성공하였습니다.',
      data: null
    })
  }

  // ANCHOR update admin username
  @UseGuards(SystemAdminGuard)
  @Put('updateAdminUsername')
  @ApiOperation({
    summary: '관리자 사용자명 변경 (시스템 관리자 기능)',
    description: '관리자를 사용자명을 변경합니다.'
  })
  async updateAdminUsername(
    @Res() res: Response,
    @Body() dto: UpdateAdminUsernameDto,
    @Session() session: any
  ) {
    // update admin username
    await this.adminService.updateAdminUsername(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateAdminUsername',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '변경사항이 반영되었습니다.',
      data: null
    })
  }

  // ANCHOR update admin level
  @UseGuards(SystemAdminGuard)
  @Put('updateAdminLevel')
  @ApiOperation({
    summary: '관리자 권한 변경 (시스템 관리자 기능)',
    description: '관리자 권한을 변경합니다.'
  })
  async updateAdminLevel(
    @Res() res: Response,
    @Body() dto: UpdateAdminLevelDto,
    @Session() session: any
  ) {
    // update admin level
    await this.adminService.updateAdminLevel(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateAdminLevel',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '변경사항이 반영되었습니다.',
      data: null
    })
  }

  // ANCHOR update admin profile
  @UseGuards(SystemAdminGuard)
  @Put('updateAdminProfile')
  @ApiOperation({
    summary: '관리자 프로필 변경 (시스템 관리자 기능)',
    description: '관리자의 프로필을 변경합니다.'
  })
  async updateAdminProfile(
    @Res() res: Response,
    @Body() dto: UpdateAdminProfileDto,
    @Session() session: any
  ) {
    // update admin profile
    await this.adminService.updateAdminProfile(dto.id, dto.profile)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateAdminProfile',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '변경사항이 반영되었습니다.',
      data: null
    })
  }

  // ANCHOR update admin intro
  @UseGuards(SystemAdminGuard)
  @Put('updateAdminIntro')
  @ApiOperation({
    summary: '관리자 소개 변경 (시스템 관리자 기능)',
    description: '관리자의 자기소개를 변경합니다.'
  })
  async updateAdminIntro(
    @Res() res: Response,
    @Body() dto: UpdateAdminIntroDto,
    @Session() session: any
  ) {
    // update admin level
    await this.adminService.updateAdminIntro(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateAdminIntro',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '변경사항이 반영되었습니다.',
      data: null
    })
  }

  // ANCHOR get login history admin list
  @UseGuards(SystemAdminGuard)
  @Get('getLoginHistoryAdminList')
  @ApiOperation({
    summary: '관리자 로그인 이력 리스트 조회 (시스템 관리자 기능)',
    description: '관리자 로그인 이력 리스트를 조회합니다.'
  })
  async getLoginHistoryAdminList(
    @Res() res: Response,
    @Query() dto: GetLoginHistoryListDto
  ) {
    // get login history list
    const data = await this.adminService.getLoginHistoryAdminList(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get user list
  @UseGuards(SystemAdminGuard)
  @Get('getUserList')
  @ApiOperation({
    summary: '사용자 리스트 조회 (시스템 관리자 기능)',
    description: '세션이 유효한 경우 사용자 리스트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '사용자 리스트 조회가 성공적인 경우 반환'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: SWAGGER.UNAUTHORIZED
  })
  async getUserList(@Res() res: Response, @Query() dto: GetUserListDto) {
    // get user
    const userList = await this.adminService.getUserList(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data: userList
    })
  }

  // ANCHOR get user detail
  @UseGuards(SystemAdminGuard)
  @Get('getUserDetail')
  @ApiOperation({
    summary: '사용자 상세 조회 (시스템 관리자 기능)',
    description: '사용자 상세 정보를 조회합니다.'
  })
  async getUserDetail(@Res() res: Response, @Query() dto: GetUserDetailDto) {
    // get user detail
    const data = await this.adminService.getUserDetail(dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR update user detail
  @UseGuards(SystemAdminGuard)
  @Put('updateUserDetail')
  @ApiOperation({
    summary: '사용자 상세 정보 변경 (시스템 관리자 기능)',
    description: '사용자 상세 정보를 변경합니다.'
  })
  async updateUserDetail(
    @Res() res: Response,
    @Body() dto: UpdateUserDetailDto,
    @Session() session: any
  ) {
    // update user detail
    await this.adminService.updateUserDetail(dto)

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateUserDetail',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '변경이 완료되었습니다.',
      data: null
    })
  }

  // ANCHOR update user is ban
  @UseGuards(SystemAdminGuard)
  @Put('updateUserIsBan')
  @ApiOperation({
    summary: '사용자 밴 상태 변경 (시스템 관리자 기능)',
    description: '사용자 밴 상태 변경 API'
  })
  async updateUserIsBan(
    @Res() res: Response,
    @Body() dto: UpdateUserIsBanDto,
    @Session() session: any
  ) {
    // delete user
    const result = await this.adminService.updateUserIsBan(dto)

    if (!result.result) {
      // 실패
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }

    // 액션 저장
    await this.actionService.saveAdminAction(
      session.userId,
      'updateUserIsBan',
      dto
    )

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }

  // ANCHOR delete user
  @UseGuards(SystemAdminGuard)
  @Post('deleteUser')
  @ApiOperation({
    summary: '사용자 삭제 (시스템 관리자 기능)',
    description: '사용자 삭제 API'
  })
  async deleteUser(
    @Res() res: Response,
    @Body() dto: DeleteUserDto,
    @Session() session: any
  ) {
    // delete user
    const result = await this.adminService.deleteUser(dto)

    if (!result.result) {
      // 실패
      throw new HttpException(result.message, HttpStatus.BAD_REQUEST)
    }

    // 액션 저장
    await this.actionService.saveAdminAction(session.userId, 'deleteUser', dto)

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: result.message,
      data: null
    })
  }
}
