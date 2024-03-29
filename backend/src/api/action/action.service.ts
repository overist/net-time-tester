import { Inject, Injectable } from '@nestjs/common'
import { HistoryAction } from 'src/entities/history-action.entity'
import { DataSource } from 'typeorm'
import { GetActionListDto } from './dto/get-action-list.dto'
import { Admin } from 'src/entities/admin.entity'
import { User } from 'src/entities/user.entity'
const mysql = require('mysql2/promise')

@Injectable()
export class ActionService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource
  ) {}

  // ANCHOR save admin action
  async saveAdminAction(adminId: number, apiName: string, dto: any) {
    const action = new HistoryAction()
    action.adminId = adminId
    action.apiName = apiName
    action.params = JSON.stringify(dto, null, 2)
    await this.datasource.getRepository(HistoryAction).save(action)
  }

  // ANCHOR get action list
  async getActionList(dto: GetActionListDto) {
    const limit = dto.limit === 0 ? 10 : dto.limit
    const offset = (dto.page - 1) * limit

    // count
    const count = await this.datasource
      .getRepository(HistoryAction)
      .createQueryBuilder('ha')
      .select(['count(1) as count'])
      .leftJoin(Admin, 'a', 'ha.admin_id = a.id')
      .where('1=1')
      .andWhere('ha.deleted_at is null')
      .andWhere(dto.adminId === '' ? '1=1' : 'a.id = :adminId', {
        adminId: dto.adminId
      })
      .andWhere(
        dto.adminAccount === '' ? '1=1' : 'a.account like :adminAccount',
        {
          adminAccount: `%${dto.adminAccount}%`
        }
      )
      .andWhere(
        dto.adminUsername === '' ? '1=1' : 'a.username like :adminUsername',
        {
          adminUsername: `%${dto.adminUsername}%`
        }
      )
      .andWhere(dto.apiName === '' ? '1=1' : 'ha.api_name like :apiName', {
        apiName: `%${dto.apiName}%`
      })
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
      .getRepository(HistoryAction)
      .createQueryBuilder('ha')
      .select(['count(1) as count'])
      .leftJoin(Admin, 'a', 'ha.admin_id = a.id')
      .where('1=1')
      .andWhere('ha.deleted_at is null')
      .getRawOne()

    // data
    const data = await this.datasource
      .getRepository(HistoryAction)
      .createQueryBuilder('ha')
      .select([
        'ha.id as id',
        'a.id as adminId',
        'a.account as adminAccount',
        'a.username as adminUsername',
        'ha.api_name as apiName',
        'ha.params as params',
        'ha.created_at as createdAt'
      ])
      .leftJoin(Admin, 'a', 'ha.admin_id = a.id')
      .where('1=1')
      .andWhere('ha.deleted_at is null')
      .andWhere(dto.adminId === '' ? '1=1' : 'a.id = :adminId', {
        adminId: dto.adminId
      })
      .andWhere(
        dto.adminAccount === '' ? '1=1' : 'a.account like :adminAccount',
        {
          adminAccount: `%${dto.adminAccount}%`
        }
      )
      .andWhere(
        dto.adminUsername === '' ? '1=1' : 'a.username like :adminUsername',
        {
          adminUsername: `%${dto.adminUsername}%`
        }
      )
      .andWhere(dto.apiName === '' ? '1=1' : 'ha.api_name like :apiName', {
        apiName: `%${dto.apiName}%`
      })
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
      .orderBy('ha.created_at', 'DESC')
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
}
