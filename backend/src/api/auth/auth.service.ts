import { Inject, Injectable } from '@nestjs/common'
import moment from 'moment'
import DATE from 'src/common/constants/date'
import { Result } from 'src/common/interface'
import { createPassword, isMatch } from 'src/common/util/auth'
import { Admin } from 'src/entities/admin.entity'
import { LoginHistoryAdmin } from 'src/entities/login-history-admin.entity'
import { LoginHistoryUser } from 'src/entities/login-history-user.entity'
import { User } from 'src/entities/user.entity'
import { DataSource, IsNull } from 'typeorm'
import { LoginDto } from './dto/login.dto'
import { UpdatePasswordDto } from './dto/update-password.dto'

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource
  ) {}

  // ANCHOR logout
  async logout(userId: number, role: string) {
    if (role === 'SYSTEM_ADMIN' || role === 'ADMIN') {
      const loginHistory = new LoginHistoryAdmin()
      loginHistory.adminId = userId
      loginHistory.type = 0
      await this.datasource.getRepository(LoginHistoryAdmin).save(loginHistory)
    } else if (role === 'USER') {
      const loginHistory = new LoginHistoryUser()
      loginHistory.userId = userId
      loginHistory.type = 0
      await this.datasource.getRepository(LoginHistoryUser).save(loginHistory)
    }
  }

  // ANCHOR login
  async login(dto: LoginDto): Promise<Result> {
    // 관리자 조회
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        account: dto.account
      }
    })

    // 관리자인 경우
    if (admin) {
      if (await isMatch(dto.password, admin.password)) {
        // 비밀번호가 일치하는 경우
        const loginHistory = new LoginHistoryAdmin()
        loginHistory.adminId = admin.id
        loginHistory.type = 1
        await this.datasource
          .getRepository(LoginHistoryAdmin)
          .save(loginHistory)
        return {
          result: true,
          message: '',
          data: { type: 'admin', data: admin }
        }
      } else {
        // 비밀번호가 일치하지 않는 경우
        return { result: false, message: '' }
      }
    }

    // 관리자 또는 사용자에 해당하지 않는 경우
    return { result: false, message: '' }
  }

  // ANCHOR update password
  async updatePassword(dto: UpdatePasswordDto) {
    if (dto.role === 'SYSTEM_ADMIN' || dto.role === 'ADMIN') {
      const admin = await this.datasource.getRepository(Admin).findOne({
        where: {
          id: dto.userId
        }
      })

      admin.password = await createPassword(dto.newPassword)
      admin.updatedAt = moment().format(DATE.DATETIME)
      await this.datasource.getRepository(Admin).save(admin)
    }
  }

  // ANCHOR get auth info
  async getAuthInfo(id: number, role: string) {
    if (role === 'SYSTEM_ADMIN' || role === 'ADMIN') {
      // 관리자의 경우
      const admin = await this.datasource.getRepository(Admin).findOne({
        select: ['id', 'account', 'username'],
        where: {
          id
        }
      })

      // 권한 주입
      admin['role'] = role

      return admin
    } else if (role === 'USER') {
      // 사용자의 경우
      const user = await this.datasource.getRepository(User).findOne({
        select: ['id', 'account', 'username'],
        where: {
          id,
          deletedAt: IsNull()
        }
      })

      // 권한 주입
      user['role'] = role

      return user
    }
  }
}
