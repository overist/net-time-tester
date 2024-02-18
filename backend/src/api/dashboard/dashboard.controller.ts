import { AdminGuard } from './../../common/guard/admin.guard'
import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Res,
  UseGuards
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Response } from 'express'
import { DashboardService } from './dashboard.service'

// ANCHOR dashboard controller
@ApiTags('dashboard')
@Controller('api/dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  // ANCHOR get admin count
  @UseGuards(AdminGuard)
  @Get('getAdminCount')
  @ApiOperation({
    summary: '관리자 카운트 (관리자 이상)',
    description: '관리자 카운트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getAdminCount(@Res() res: Response) {
    const data = await this.dashboardService.getAdminCount()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get login history admin count
  @UseGuards(AdminGuard)
  @Get('getLoginHistoryAdminCount')
  @ApiOperation({
    summary: '로그인 이력 카운트 (관리자 이상)',
    description: '로그인 이력 카운트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getLoginHistoryAdminCount(@Res() res: Response) {
    const data = await this.dashboardService.getLoginHistoryAdminCount()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get user count
  @UseGuards(AdminGuard)
  @Get('getUserCount')
  @ApiOperation({
    summary: '사용자 카운트 (관리자 이상)',
    description: '사용자 카운트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getUserCount(@Res() res: Response) {
    const data = await this.dashboardService.getUserCount()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get image count
  @UseGuards(AdminGuard)
  @Get('getImageCount')
  @ApiOperation({
    summary: '이미지 카운트 (관리자 이상)',
    description: '이미지 카운트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getImageCount(@Res() res: Response) {
    const data = await this.dashboardService.getImageCount()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get setting count
  @UseGuards(AdminGuard)
  @Get('getSettingCount')
  @ApiOperation({
    summary: '설정 카운트 (관리자 이상)',
    description: '설정 카운트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getSettingCount(@Res() res: Response) {
    const data = await this.dashboardService.getSettingCount()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }

  // ANCHOR get user line chart
  @UseGuards(AdminGuard)
  @Get('getUserLineChart')
  @ApiOperation({
    summary: '회원 라인 차트 (관리자 이상)',
    description: '회원 라인 차트를 반환합니다.'
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '데이터 조회가 성공적인 경우 반환'
  })
  async getUserLineChart(@Res() res: Response) {
    const data = await this.dashboardService.getUserLineChart()

    // return 200 response
    res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: '',
      data
    })
  }
}
