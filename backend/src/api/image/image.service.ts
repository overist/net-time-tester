import { Inject, Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { v4 as uuidv4 } from 'uuid'
import * as fs from 'fs'
import { formatBytes } from 'src/common/util/auth'
import { getUploadPath } from 'src/common/util'
import { File } from 'src/entities/file.entity'
import { Result } from 'src/common/interface'
// import { GetListDto } from './dto/get-list.dto'
import { GlobalService } from '../global/global.service'
import { GetListDto } from './dto/get-list.dto'

@Injectable()
export class ImageService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource,

    private globalService: GlobalService
  ) {}

  // ANCHOR upload
  async upload(files: any, note: string): Promise<Result> {
    // 업로드 경로 가져오기
    const uploadPath = getUploadPath()
    const fileList = []

    // upload 디렉토리가 존재하지 않을시 생성
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath)
    }

    // validation
    if (!files) {
      return { result: false, message: 'File does not exist' }
    }

    for (const file of files) {
      // 파일 정보 파싱
      const rawName = file.originalname
      const extension = file.originalname.split('.').pop()
      const uuid = uuidv4()
      const encName = `${uuid}.${extension}`
      const size = file.size
      const hSize = formatBytes(size)
      const absPath = `${uploadPath}/${encName}`

      // 파일 데이터 저장
      const f = new File()
      f.rawName = rawName
      f.encName = encName
      f.extension = extension
      f.size = size
      f.hSize = hSize
      f.absPath = absPath
      f.note = note
      const fileData = await this.datasource.getRepository(File).save(f)
      fileData['url'] =
        (await this.globalService.getGlobal('imageDomain')) + '/' + encName
      fileList.push(fileData)

      // 파일 저장
      fs.writeFileSync(absPath, file.buffer)
    }

    return { result: true, message: '', data: fileList }
  }

  // ANCHOR get list
  async getList(dto: GetListDto) {
    const limit = 100
    const offset = (dto.page - 1) * limit

    // count
    const count = await this.datasource
      .getRepository(File)
      .createQueryBuilder('f')
      .select(['count(1) as count'])
      .where('1=1')
      .getRawOne()

    // data
    const data = await this.datasource
      .getRepository(File)
      .createQueryBuilder('f')
      .select([
        'id as id',
        'table_name as tableName',
        'table_pk as tablePk',
        'type as type',
        'raw_name as rawName',
        'enc_name as encName',
        'extension as extension',
        'size as size',
        'h_size as hSize',
        'abs_path as absPath',
        'note as note',
        `concat('${await this.globalService.getGlobal(
          'imageDomain'
        )}', '/', enc_name) as url`,
        'created_at as createdAt',
        'updated_at as updatedAt',
        'deleted_at as deletedAt'
      ])
      .where('1=1')
      .orderBy('f.created_at', 'DESC')
      .limit(limit)
      .offset(offset)
      .getRawMany()

    return {
      count: Number(count.count),
      data
    }
  }

  // ANCHOR image mapping
  async mapping(tableName: string, tablePK: number, imagePK: number) {
    const image = await this.datasource.getRepository(File).findOne({
      where: {
        id: imagePK
      }
    })

    image.tableName = tableName
    image.tablePk = tablePK
    await this.datasource.getRepository(File).save(image)
  }
}
