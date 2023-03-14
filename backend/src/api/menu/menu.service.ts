import { DeleteMenuDto } from './dto/delete-menu.dto'
import { UpdateMenuDto } from './dto/update-menu.dto copy'
import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { GetMenuListDto } from './dto/get-menu-list.dto'
import moment from 'moment'
import DATE from 'src/common/constants/date'
import { CreateMenuDto } from './dto/create-menu.dto'
import { Menu } from 'src/entities/menu.entity'
import { MenuOrder } from 'src/entities/menu-order.entity'

@Injectable()
export class MenuService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource
  ) {}

  // ANCHOR get menu list
  async getMenuList(dto: GetMenuListDto) {
    // data
    const data = await this.datasource
      .getRepository(Menu)
      .createQueryBuilder('m')
      .select([
        'm.id as id',
        'm.type as type',
        'm.title as title',
        'm.icon as icon',
        // 'mo.permission as permission',
        // 'mo.menu_order as menuOrder',
        'm.path as path',
        'm.page_id as pageId',
        'm.created_at as createdAt',
        'm.updated_at as updatedAt'
      ])
      // .leftJoin(MenuOrder, 'mo', 'm.id = mo.menu_id')
      .where('1=1')
      .andWhere('m.deleted_at is null')
      .orderBy('m.created_at', 'DESC')
      .getRawMany()

    return {
      data
    }
  }

  // ANCHOR get menu
  async getMenu(role: string) {
    // data
    const data = await this.datasource
      .getRepository(Menu)
      .createQueryBuilder('m')
      .select([
        'm.id as id',
        'm.type as type',
        'm.title as title',
        'm.icon as icon',
        'm.route as route',
        'mo.permission as permission',
        'mo.menu_order as menuOrder',
        'm.path as path',
        'm.page_id as pageId',
        'm.created_at as createdAt',
        'm.updated_at as updatedAt'
      ])
      .leftJoin(MenuOrder, 'mo', 'm.id = mo.menu_id')
      .where('1=1')
      .andWhere('mo.permission = :role', { role })
      .andWhere('m.deleted_at is null')
      .orderBy('mo.menu_order', 'ASC')
      .getRawMany()

    return {
      data
    }
  }

  // ANCHOR get menu list
  async getMenuOrderList(dto: GetMenuListDto) {
    // data
    const menuOrderList = await this.datasource.getRepository(MenuOrder).find({
      where: {
        permission: dto.permission
      },
      order: {
        menuOrder: 'ASC'
      }
    })

    return menuOrderList
  }

  // ANCHOR create menu
  async createMenu(dto: CreateMenuDto) {
    const menu = new Menu()
    menu.type = dto.type
    menu.title = dto.title
    menu.icon = dto.icon
    menu.path = dto.path
    menu.route = dto.route
    menu.pageId = dto.pageId

    await this.datasource.getRepository(Menu).save(menu)
  }

  // ANCHOR update menu
  async updateMenu(dto: UpdateMenuDto) {
    await this.datasource
      .getRepository(MenuOrder)
      .createQueryBuilder('mo')
      .delete()
      .where('permission = :permission', { permission: dto.permission })
      .execute()

    for (let i = 0; i < dto.menuIdList.length; i++) {
      const menuOrder = new MenuOrder()
      menuOrder.menuId = dto.menuIdList[i]
      menuOrder.permission = dto.permission
      menuOrder.menuOrder = i + 1

      await this.datasource.getRepository(MenuOrder).save(menuOrder)
    }
  }

  // ANCHOR update menu
  async deleteMenu(dto: DeleteMenuDto) {
    // data
    const menuList = await this.datasource.getRepository(Menu).findOne({
      where: {
        id: dto.id
      }
    })

    menuList.deletedAt = moment().format(DATE.DATETIME)

    await this.datasource.getRepository(Menu).save(menuList)
  }
}
