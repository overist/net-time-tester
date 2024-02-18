import { LoginHistoryAdmin } from './../../entities/login-history-admin.entity'
import { User } from './../../entities/user.entity'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import DATE from 'src/common/constants/date'
import { createPassword } from 'src/common/util/auth'
import { Admin } from 'src/entities/admin.entity'
import { DataSource, In, IsNull } from 'typeorm'
import { CreateSystemAdminDto } from './dto/create-system-admin.dto'
import moment from 'moment'
import { GetAdminListDto } from './dto/get-admin-list.dto'
import { GetAdminDetailDto } from './dto/get-admin-detail.dto'
import { CreateAdminDto } from './dto/create-admin.dto'
import { DeleteAdminDto } from './dto/delete-admin.dto'
import { UpdateAdminPasswordDto } from './dto/update-admin-password.dto'
import { UpdateAdminUsernameDto } from './dto/update-admin-username.dto'
import { UpdateAdminLevelDto } from './dto/update-admin-level.dto'
import { GetLoginHistoryListDto } from './dto/get-login-history-list.dto'
import { File } from 'src/entities/file.entity'
import { UpdateAdminIntroDto } from './dto/update-admin-intro.dto'
import { GlobalService } from '../global/global.service'
import { GetUserListDto } from './dto/get-user-list.dto'
import { v4 as uuidv4 } from 'uuid'
import { GetUserDetailDto } from './dto/get-user-detail.dto'
import { UpdateUserDetailDto } from './dto/update-user-detail.dto'
import BigNumber from 'bignumber.js'
import { DeleteUserDto } from './dto/delete-user.dto'
import { UpdateUserIsBanDto } from './dto/update-user-is-ban.dto'

@Injectable()
export class AdminService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource,
    private globalService: GlobalService
  ) {}

  // ANCHOR check system admin
  async checkSystemAdmin(): Promise<boolean> {
    const adminList = await this.datasource.getRepository(Admin).find({
      where: {
        isSystemAdmin: 1,
        deletedAt: IsNull()
      }
    })
    if (adminList.length === 0) {
      return true
    } else {
      return false
    }
  }

  // ANCHOR create system admin
  async createSystemAdmin(dto: CreateSystemAdminDto) {
    const admin = new Admin()
    admin.account = dto.account
    admin.password = await createPassword(dto.password)
    admin.username = dto.username
    admin.isSystemAdmin = 1
    admin.isAdmin = 1
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR get admin by user id
  async getAdminByUserId(userId: number) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: userId,
        deletedAt: IsNull()
      }
    })

    const profile = await this.datasource.getRepository(File).find({
      where: {
        tableName: '_admin',
        tablePk: userId
      }
    })

    if (profile.length !== 0) {
      profile[0]['url'] =
        (await this.globalService.getGlobal('imageDomain')) +
        '/' +
        profile[0].encName
    }
    admin['profile'] = profile[0]

    return admin
  }

  // ANCHOR get admin by account
  async getAdminByAccount(account: string) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        account,
        deletedAt: IsNull()
      }
    })

    return admin
  }

  // ANCHOR get admin list
  async getAdminList(dto: GetAdminListDto) {
    const limit = dto.limit === 0 ? 10 : dto.limit
    const offset = (dto.page - 1) * limit

    // count
    const count = await this.datasource
      .getRepository(Admin)
      .createQueryBuilder('a')
      .select(['count(1) as count'])
      .leftJoin(
        (qb) =>
          qb
            .from(File, 'file')
            .select('file.table_pk')
            .where('file.table_name = :table_name', { table_name: '_admin' }),
        'f',
        'a.id = f.table_pk'
      )
      .where('1=1')
      .andWhere('a.deleted_at is null')
      .andWhere(dto.account === '' ? '1=1' : 'a.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(
        dto.level === 'SA' ? 'is_system_admin = 1 and is_admin = 1' : '1=1'
      )
      .andWhere(
        dto.level === 'A' ? 'is_system_admin = 0 and is_admin = 1' : '1=1'
      )
      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(a.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === '' ? '1=1' : 'DATE(a.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .getRawOne()

    // count
    const totalCount = await this.datasource
      .getRepository(Admin)
      .createQueryBuilder('a')
      .select(['count(1) as count'])
      .leftJoin(
        (qb) =>
          qb
            .from(File, 'file')
            .select('file.table_pk')
            .where('file.table_name = :table_name', { table_name: '_admin' }),
        'f',
        'a.id = f.table_pk'
      )
      .where('1=1')
      .andWhere('a.deleted_at is null')
      .getRawOne()

    // data
    const data = await this.datasource
      .getRepository(Admin)
      .createQueryBuilder('a')
      .select([
        'a.id as id',
        'a.account as account',
        'a.password as password',
        'a.username as username',
        'a.intro as intro',
        'file_id as profileId',
        'f.abs_path as abs_path',
        `concat('${await this.globalService.getGlobal(
          'imageDomain'
        )}', '/', f.enc_name) as url`,
        `case
          when is_system_admin = 1 and is_admin = 1
          then 1
          else 0
        end as level`,
        'is_system_admin as isSystemAdmin',
        'is_admin as isAdmin',
        'a.created_at as createdAt',
        'a.updated_at as updatedAt'
      ])
      .leftJoin(
        (qb) =>
          qb
            .from(File, 'file')
            .select([
              'file.id as file_id',
              'file.abs_path',
              'file.table_pk',
              'file.enc_name'
            ])
            .where('file.table_name = :table_name', { table_name: '_admin' }),
        'f',
        'a.id = f.table_pk'
      )
      .where('1=1')
      .andWhere('a.deleted_at is null')
      .andWhere(dto.account === '' ? '1=1' : 'a.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(
        dto.level === 'SA' ? 'is_system_admin = 1 and is_admin = 1' : '1=1'
      )
      .andWhere(
        dto.level === 'A' ? 'is_system_admin = 0 and is_admin = 1' : '1=1'
      )
      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(a.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === '' ? '1=1' : 'DATE(a.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .orderBy('a.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany()

    return {
      count: Number(count.count),
      data: data,
      info: [
        { label: '현재', value: Number(count.count) },
        { label: '전체', value: Number(totalCount.count) }
      ]
    }
  }

  // ANCHOR get admin detail
  async getAdminDetail(dto: GetAdminDetailDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    const profile = await this.datasource.getRepository(File).find({
      where: {
        tableName: '_admin',
        tablePk: dto.id
      }
    })

    if (profile.length !== 0) {
      profile[0]['url'] =
        (await this.globalService.getGlobal('imageDomain')) +
        '/' +
        profile[0].encName
    }
    admin['profile'] = profile

    return admin
  }

  // ANCHOR create admin
  async createAdmin(dto: CreateAdminDto) {
    const admin = new Admin()
    admin.account = dto.account
    admin.password = await createPassword(dto.password)
    admin.username = dto.username
    admin.intro = dto.intro

    if (dto.level === 'SA') {
      admin.isSystemAdmin = 1
      admin.isAdmin = 1
    } else {
      admin.isSystemAdmin = 0
      admin.isAdmin = 1
    }
    const createdAdmin = await this.datasource.getRepository(Admin).save(admin)
    if (dto.profile) {
      await this.updateAdminProfile(createdAdmin.id, dto.profile)
    }
  }

  // ANCHOR delete admin
  async deleteAdmin(dto: DeleteAdminDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    if (!admin) {
      throw new HttpException(
        {
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'Target to delete does not exist.',
          data: null
        },
        HttpStatus.BAD_REQUEST
      )
    }

    admin.deletedAt = moment().format(DATE.DATETIME)
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR update admin password
  async updateAdminPassword(dto: UpdateAdminPasswordDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })
    admin.password = await createPassword(dto.newPassword)
    admin.updatedAt = moment().format(DATE.DATETIME)
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR update admin username
  async updateAdminUsername(dto: UpdateAdminUsernameDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })
    admin.username = dto.username
    admin.updatedAt = moment().format(DATE.DATETIME)
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR update admin level
  async updateAdminLevel(dto: UpdateAdminLevelDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })
    if (dto.level === 'SA') {
      admin.isSystemAdmin = 1
      admin.isAdmin = 1
    } else {
      admin.isSystemAdmin = 0
      admin.isAdmin = 1
    }
    admin.updatedAt = moment().format(DATE.DATETIME)
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR update admin profile
  async updateAdminProfile(userId: number, profile: number[]) {
    const adminProfile = await this.datasource.getRepository(File).findOne({
      where: {
        tableName: '_admin',
        tablePk: userId
      }
    })

    if (adminProfile) {
      adminProfile.tableName = null
      adminProfile.tablePk = null
      adminProfile.updatedAt = moment().format(DATE.DATETIME)
      await this.datasource.getRepository(File).save(adminProfile)
    }
    if (profile[0]) {
      const updateProfile = await this.datasource.getRepository(File).findOne({
        where: {
          id: profile[0]
        }
      })
      updateProfile.tableName = '_admin'
      updateProfile.tablePk = userId
      await this.datasource.getRepository(File).save(updateProfile)
    }
  }

  // ANCHOR update admin intro
  async updateAdminIntro(dto: UpdateAdminIntroDto) {
    const admin = await this.datasource.getRepository(Admin).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    admin.intro = dto.intro
    await this.datasource.getRepository(Admin).save(admin)
  }

  // ANCHOR get login history admin list
  async getLoginHistoryAdminList(dto: GetLoginHistoryListDto) {
    const limit = dto.limit === 0 ? 10 : dto.limit
    const offset = (dto.page - 1) * limit

    // count
    const count = await this.datasource
      .getRepository(LoginHistoryAdmin)
      .createQueryBuilder('lh')
      .select(['count(1) as count'])
      .innerJoin(Admin, 'a', 'lh.admin_id = a.id')
      .where('1=1')
      .andWhere('lh.deleted_at is null')
      .andWhere(dto.account === '' ? '1=1' : 'a.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(dto.type === '' ? '1=1' : 'lh.type = :type', {
        type: `${dto.type}`
      })
      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(lh.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === ''
          ? '1=1'
          : 'DATE(lh.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .getRawOne()

    // count
    const totalCount = await this.datasource
      .getRepository(LoginHistoryAdmin)
      .createQueryBuilder('lh')
      .select(['count(1) as count'])
      .innerJoin(Admin, 'a', 'lh.admin_id = a.id')
      .where('1=1')
      .andWhere('lh.deleted_at is null')
      .getRawOne()

    // count
    const loginCount = await this.datasource
      .getRepository(LoginHistoryAdmin)
      .createQueryBuilder('lh')
      .select(['count(1) as count'])
      .innerJoin(Admin, 'a', 'lh.admin_id = a.id')
      .where('1=1')
      .andWhere('lh.deleted_at is null')
      .andWhere('lh.type = 1')
      .getRawOne()

    // count
    const logoutCount = await this.datasource
      .getRepository(LoginHistoryAdmin)
      .createQueryBuilder('lh')
      .select(['count(1) as count'])
      .innerJoin(Admin, 'a', 'lh.admin_id = a.id')
      .where('1=1')
      .andWhere('lh.deleted_at is null')
      .andWhere('lh.type = 0')
      .getRawOne()

    // data
    const data = await this.datasource
      .getRepository(LoginHistoryAdmin)
      .createQueryBuilder('lh')
      .select([
        'lh.id as id',
        'lh.admin_id as userId',
        'a.account as account',
        'a.username as username',
        'lh.type as type',
        'lh.created_at as createdAt',
        'lh.updated_at as updatedAt'
      ])
      .innerJoin(Admin, 'a', 'lh.admin_id = a.id')
      .where('1=1')
      .andWhere('lh.deleted_at is null')
      .andWhere(dto.account === '' ? '1=1' : 'a.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(dto.type === '' ? '1=1' : 'lh.type = :type', {
        type: `${dto.type}`
      })
      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(lh.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === ''
          ? '1=1'
          : 'DATE(lh.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .orderBy('lh.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany()

    return {
      count: Number(count.count),
      data: data,
      info: [
        { label: '현재', value: Number(count.count) },
        { label: '전체', value: Number(totalCount.count) },
        { label: '로그인', value: Number(loginCount.count) },
        { label: '로그아웃', value: Number(logoutCount.count) }
      ]
    }
  }

  // ANCHOR get user list
  async getUserList(dto: GetUserListDto) {
    const limit = dto.limit === 0 ? 10 : dto.limit
    const offset = (dto.page - 1) * limit

    // count
    const count = await this.datasource
      .getRepository(User)
      .createQueryBuilder('u')
      .select(['count(1) as count'])
      .where('1=1')
      .andWhere('u.deleted_at is null')
      .andWhere(dto.userId === '' ? '1=1' : 'u.id = :userId', {
        userId: dto.userId
      })
      .andWhere(dto.account === '' ? '1=1' : 'u.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(dto.username === '' ? '1=1' : 'u.username like :username', {
        username: `%${dto.username}%`
      })

      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(u.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === '' ? '1=1' : 'DATE(u.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .getRawOne()

    // count
    const totalCount = await this.datasource
      .getRepository(User)
      .createQueryBuilder('u')
      .select(['count(1) as count'])
      .where('1=1')
      .andWhere('u.deleted_at is null')
      .getRawOne()

    // count
    const deleteCount = await this.datasource
      .getRepository(User)
      .createQueryBuilder('u')
      .select(['count(1) as count'])
      .where('1=1')
      .andWhere('u.deleted_at is not null')
      .getRawOne()

    // data
    const data = await this.datasource
      .getRepository(User)
      .createQueryBuilder('u')
      .select([
        'u.id as id',
        'u.account as account',
        'u.username as username',
        'u.intro as intro',
        'u.is_ban as isBan',
        'u.created_at as createdAt',
        'u.updated_at as updatedAt',
        'u.deleted_at as deletedAt',

        // 추가 정보
        `concat('${await this.globalService.getGlobal(
          'imageDomain'
        )}', '/', f.enc_name) as url`
      ])
      .leftJoin(File, 'f', 'u.profile_img = f.id')
      .where('1=1')
      .andWhere('u.deleted_at is null')
      .andWhere(dto.userId === '' ? '1=1' : 'u.id = :userId', {
        userId: dto.userId
      })
      .andWhere(dto.account === '' ? '1=1' : 'u.account like :account', {
        account: `%${dto.account}%`
      })
      .andWhere(dto.username === '' ? '1=1' : 'u.username like :username', {
        username: `%${dto.username}%`
      })

      .andWhere(
        dto.createdStartAt === ''
          ? '1=1'
          : 'DATE(u.created_at) >= :createdStartAt',
        {
          createdStartAt: dto.createdStartAt
        }
      )
      .andWhere(
        dto.createdEndAt === '' ? '1=1' : 'DATE(u.created_at) <= :createdEndAt',
        {
          createdEndAt: dto.createdEndAt
        }
      )
      .orderBy('u.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany()

    return {
      count: Number(count.count),
      data: data,
      info: [
        { label: '현재', value: Number(count.count) },
        { label: '전체', value: Number(totalCount.count) },
        { label: '삭제', value: Number(deleteCount.count) }
      ]
    }
  }

  // ANCHOR get user detail
  async getUserDetail(dto: GetUserDetailDto) {
    const user = await this.datasource.getRepository(User).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    return user
  }

  // ANCHOR update user detail
  async updateUserDetail(dto: UpdateUserDetailDto) {
    const user = await this.datasource.getRepository(User).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    if (!user) {
      //
      // throw new NotFoundException('user not found')
    }

    user.username = dto.username
    user.account = dto.account

    await this.datasource.getRepository(User).save(user)
  }

  // ANCHOR update user is ban
  async updateUserIsBan(dto: UpdateUserIsBanDto) {
    const user = await this.datasource.getRepository(User).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    if (!user) {
      return {
        result: false,
        message: '유효하지 않은 사용자입니다.'
      }
    }

    user.isBan = dto.isBan

    await this.datasource.getRepository(User).save(user)

    return {
      result: true,
      message:
        dto.isBan === 1
          ? '사용자가 밴되었습니다.'
          : '사용자의 밴이 해제되었습니다.'
    }
  }

  // ANCHOR delete user
  async deleteUser(dto: DeleteUserDto) {
    const user = await this.datasource.getRepository(User).findOne({
      where: {
        id: dto.id,
        deletedAt: IsNull()
      }
    })

    if (!user) {
      return {
        result: false,
        message: '유효하지 않은 사용자입니다.'
      }
    }

    user.deletedAt = moment().format(DATE.DATETIME)

    await this.datasource.getRepository(User).save(user)

    return {
      result: true,
      message: '사용자가 삭제되었습니다.'
    }
  }
}
