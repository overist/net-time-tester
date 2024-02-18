import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger
} from '@nestjs/common'
import { DataSource, In, IsNull } from 'typeorm'
import { User } from 'src/entities/user.entity'
import { ConfigService } from '@nestjs/config'
import { HttpService } from '@nestjs/axios'
import { GlobalService } from '../global/global.service'
import moment from 'moment'
import DATE from 'src/common/constants/date'
import { v4 as uuidv4 } from 'uuid'
import BigNumber from 'bignumber.js'

import { LoginKakaoDto } from './dto/login-kakao.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { Category } from 'src/entities/category.entity'
import { UserParticipation } from 'src/entities/user-participation.entity'
import { JoinCategoryDto } from './dto/join-category.dto'
import { LeaveCategoryDto } from './dto/leave-category.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { File } from 'src/entities/file.entity'
import { Post } from 'src/entities/post.entity'
import { GetPostListDto } from './dto/get-post-list.dto'
import { GetAllPostListDto } from './dto/get-all-post-list.dto'
import { DeletePostDto } from './dto/delete-post.dto'
import { FollowUserDto } from './dto/follow-user.dto'
import { UserFollow } from 'src/entities/user-follow.entity'
import { UnfollowUserDto } from './dto/unfollow-user.dto'
import { AddLikePostDto } from './dto/add-like-post.dto'
import { PostLike } from 'src/entities/post-like.entity'
import { RemoveLikePostDto } from './dto/remoe-like-post.dto'
import { CreateCategoryDto } from './dto/create-category.dto'

@Injectable()
export class MainService {
  constructor(
    @Inject('DATA_SOURCE')
    private datasource: DataSource,
    private globalService: GlobalService,
    private configService: ConfigService,
    private httpService: HttpService
  ) {}

  // ANCHOR 유저정보조회
  async getUser(userId: number) {
    const user = await this.datasource
      .getRepository(User)
      .createQueryBuilder('u')
      .select([
        'u.id as id',
        'u.account as account',
        'u.username as username',
        'u.intro as intro',
        'u.profileImg as profileImg'
      ])
      .where('u.id = :userId ', { userId })
      .andWhere('u.deletedAt is null')
      .getRawOne()

    return {
      result: true,
      data: user ?? null,
      message: ''
    }
  }

  // ANCHOR 시스템 정보 조회
  async getSysInfo(userId: number | null) {
    const result = await this.getAllCategoryList()
    const allCategoryList = result.data

    let myCategoryList = []
    if (userId) {
      const result2 = await this.getMyCategoryList(userId)
      myCategoryList = result2.data
    }

    return {
      data: {
        allCategoryList,
        myCategoryList
      },
      message: '시스템 정보 조회 성공'
    }
  }

  // LINK 카카오 로그인 1단계 - 토큰 발급
  async getTokenFromKakao(authCode: string) {
    const kakaoClientId = this.configService.get<string>('kakaoClientId')
    const redirectURI = this.configService.get<string>('kakaoRedirectUri')
    const tokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoClientId}&redirect_uri=${redirectURI}&code=${authCode}`

    const response: {
      token_type: string
      access_token: string
      refresh_token: string
      id_token: string
      expires_in: number
      refresh_token_expires_in: string
      scope: string
    } = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }).then((res) => res.json())

    return response
  }

  // LINK 카카오 로그인 2단계 - 사용자 정보 조회
  async getUserFromKakao({ access_token }: { access_token: string }) {
    const userInfoUrl = 'https://kapi.kakao.com/v2/user/me'
    const response = await fetch(userInfoUrl, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`
      }
    }).then((res) => res.json())

    return response
  }

  // ANCHOR 로그인
  async loginKakao(dto: LoginKakaoDto): Promise<any> {
    Logger.log(`[loginKakao 함수 / 시작] dto = ${dto}`)

    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()

    await queryRunner.startTransaction()

    try {
      const accessToken = await this.getTokenFromKakao(dto.code)
      const kakaoUserInfo = await this.getUserFromKakao(accessToken)

      // 사용자 조회
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: {
          kakaoId: kakaoUserInfo.id,
          deletedAt: IsNull()
        }
      })

      // 유효성 - 계정이 없는 경우
      if (!user) {
        Logger.log(`[signIn 함수 / 계정이 존재하지 않음] dto = ${dto}`)

        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: true,
          data: { user: null, kakaoId: kakaoUserInfo.id },
          message: '계정이 존재하지 않습니다. 회원가입 페이지로 이동합니다.'
        }
      }

      await queryRunner.commitTransaction()

      return {
        result: true,
        data: { user, kakaoId: kakaoUserInfo.id },
        message: '로그인이 완료되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 회원가입
  async signUp(dto: SignUpDto) {
    Logger.log(`[signUp 함수 / 시작] dto.account = ${dto.account}`)

    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()

    await queryRunner.startTransaction()

    try {
      // 유효성 - 카카오 로그인 체크
      if (!dto.kakaoId) {
        // rollback
        await queryRunner.rollbackTransaction()

        // 실패
        return {
          result: false,
          message: '카카오 로그인이 되지 않았습니다.'
        }
      }

      // 아이디 유효성 - 아이디는 영어 대소문자와 숫자로만 이루어져야 합니다.
      const account = dto.account
      const pattern = /^[a-zA-Z0-9]+$/
      if (!pattern.test(account)) {
        // rollback
        await queryRunner.rollbackTransaction()

        // 실패
        return {
          result: false,
          message: '아이디는 영어 대소문자와 숫자로만 이루어져야 합니다.'
        }
      }

      // 사용자 조회
      const user = await queryRunner.manager.getRepository(User).findOne({
        where: {
          account: dto.account
        },
        lock: {
          mode: 'pessimistic_write'
        }
      })

      // 유효성: 사용자가 이미 존재하는 경우
      if (user) {
        Logger.log(
          `[signUp 함수 / 사용자가 이미 존재] dto.account = ${dto.account}`
        )

        // rollback
        await queryRunner.rollbackTransaction()

        // 실패
        return {
          result: false,
          message: '이미 존재하는 아이디입니다.'
        }
      }

      // 회원가입
      const newUser = new User()
      newUser.kakaoId = dto.kakaoId
      newUser.account = dto.account.trim()
      newUser.username = dto.username
      newUser.intro = dto.intro
      newUser.profileImg = dto.fileId
      newUser.createdAt = moment().format(DATE.DATETIME)

      // 대소문자로 인해 유효성을 뚫고 중복 회원가입이 되는 경우 방지
      await queryRunner.manager.getRepository(User).save(newUser)

      // commit
      await queryRunner.commitTransaction()

      Logger.log(`[signUp 함수 / 성공] dto.account = ${dto.account}`)

      // 성공
      return {
        result: true,
        message: '회원가입 완료',
        data: { userId: newUser.id }
      }
    } catch (err) {
      Logger.error(`[ERROR] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 사용자 팔로우
  async followUser(dto: FollowUserDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const followUser = await queryRunner.manager.getRepository(User).findOne({
        where: {
          id: dto.followId,
          deletedAt: IsNull()
        }
      })

      if (!followUser) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '팔로우할 유저가 존재하지 않습니다.'
        }
      }

      const userFollow = await queryRunner.manager
        .getRepository(UserFollow)
        .findOne({
          where: {
            userId: dto.userId,
            followId: dto.followId,
            deletedAt: IsNull()
          },
          lock: {
            mode: 'pessimistic_write'
          }
        })

      if (userFollow) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '이미 팔로우중입니다.'
        }
      }

      const newUserFollow = new UserFollow()
      newUserFollow.userId = dto.userId
      newUserFollow.followId = dto.followId
      newUserFollow.createdAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(User).save(newUserFollow)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '팔로우가 완료되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR / followUser 함수] dto = ${dto}`)
      Logger.error(`[ERROR / followUser 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 사용자 언팔로우
  async unfollowUser(dto: UnfollowUserDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const userFollow = await queryRunner.manager
        .getRepository(UserFollow)
        .findOne({
          where: {
            userId: dto.userId,
            followId: dto.followId,
            deletedAt: IsNull()
          },
          lock: {
            mode: 'pessimistic_write'
          }
        })

      if (!userFollow) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '팔로우중이지 않습니다.'
        }
      }

      userFollow.deletedAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(UserFollow).save(userFollow)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '언팔로우가 완료되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR / unfollowUser 함수] dto = ${dto}`)
      Logger.error(`[ERROR / unfollowUser 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 카테고리 리스트 조회(전체)
  async getAllCategoryList() {
    const imageDomain = await this.globalService.getGlobal('imageDomain')

    const categoryList = await this.datasource
      .getRepository(Category)
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.subject as subject',
        'c.description as description',

        `IFNULL(
          concat('${imageDomain}', '/', f.enc_name),
        null) as iconUrl`
      ])
      .leftJoin(File, 'f', 'c.icon_img = f.id')
      .where('c.deletedAt is null')
      .getRawMany()

    return {
      result: true,
      data: categoryList,
      message: ''
    }
  }

  // ANCHOR 카테고리 리스트 조회(내가 참여한 카테고리)
  async getMyCategoryList(usdrId: number) {
    const imageDomain = await this.globalService.getGlobal('imageDomain')

    const categoryList = await this.datasource
      .getRepository(Category)
      .createQueryBuilder('c')
      .select([
        'c.id as id',
        'c.subject as subject',
        'c.description as description',

        'IFNULL(cu.id, null) as isParticipated',

        `IFNULL(
          concat('${imageDomain}}', '/', f.enc_name),
        null) as iconUrl`
      ])
      .leftJoin(File, 'f', 'c.icon_img = f.id')
      .leftJoin(
        UserParticipation,
        'cu',
        'c.id = cu.categoryId and cu.userId = :userId and cu.deletedAt is null',
        { userId: usdrId }
      )
      .where('c.deletedAt is null')
      .getRawMany()

    return {
      result: true,
      data: categoryList,
      message: ''
    }
  }

  // ANCHOR 카테고리 참여
  async joinCategory(dto: JoinCategoryDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const userParticipation = await queryRunner.manager
        .getRepository(UserParticipation)
        .findOne({
          where: {
            userId: dto.userId,
            categoryId: dto.categoryId,
            deletedAt: IsNull()
          },
          lock: {
            mode: 'pessimistic_write'
          }
        })

      if (userParticipation) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '이미 참여중입니다.'
        }
      }

      const newUserParticipation = new UserParticipation()
      newUserParticipation.userId = dto.userId
      newUserParticipation.categoryId = dto.categoryId
      newUserParticipation.createdAt = moment().format(DATE.DATETIME)

      await queryRunner.manager
        .getRepository(UserParticipation)
        .save(newUserParticipation)

      // commit
      await queryRunner.commitTransaction()
    } catch (err) {
      Logger.error(`[ERROR / userParticipation 함수] dto = ${dto}`)
      Logger.error(`[ERROR / userParticipation 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 카테고리 탈퇴
  async leaveCategory(dto: LeaveCategoryDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const userParticipation = await queryRunner.manager
        .getRepository(UserParticipation)
        .findOne({
          where: {
            userId: dto.userId,
            categoryId: dto.categoryId,
            deletedAt: IsNull()
          },
          lock: {
            mode: 'pessimistic_write'
          }
        })

      if (!userParticipation) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '참여하지 않은 카테고리입니다.'
        }
      }

      userParticipation.deletedAt = moment().format(DATE.DATETIME)

      await queryRunner.manager
        .getRepository(UserParticipation)
        .save(userParticipation)

      // commit
      await queryRunner.commitTransaction()
    } catch (err) {
      Logger.error(`[ERROR / leaveCategory 함수] dto = ${dto}`)
      Logger.error(`[ERROR / leaveCategory 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 카테고리 생성
  async createCategory(dto: CreateCategoryDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const newCategory = new Category()
      newCategory.createrId = dto.userId
      newCategory.subject = dto.subject
      newCategory.iconImg = dto.fileId
      newCategory.createdAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(Category).save(newCategory)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '카테고리 생성 완료'
      }
    } catch (err) {
      Logger.error(`[ERROR / createCategory 함수] dto = ${dto}`)
      Logger.error(`[ERROR / createCategory 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 신규 포스트 생성
  async createPost(dto: CreatePostDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      // 포스트 생성
      const newPost = new Post()
      newPost.userId = dto.userId
      newPost.categoryId = dto.categoryId
      newPost.netTime = dto.netTime
      newPost.content = dto.content
      newPost.image = dto.fileId
      newPost.createdAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(Post).save(newPost)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '포스트 생성 완료'
      }
    } catch (err) {
      Logger.error(`[ERROR / createPost 함수] dto = ${dto}`)
      Logger.error(`[ERROR / createPost 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 리스트 조회 (전체)
  async getAllPostList(dto: GetAllPostListDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const postList = await queryRunner.manager
        .getRepository(Post)
        .createQueryBuilder('p')
        .select([
          'p.id as id',
          'p.netTime as netTime',
          'p.content as content',
          'p.createdAt as createdAt',

          `IFNULL(
            concat('${await this.globalService.getGlobal(
              'imageDomain'
            )}', '/', f.enc_name),
          null) as imageUrl`
        ])
        .leftJoin(File, 'f', 'p.image = f.id')
        .where('p.deletedAt is null')
        .orderBy('p.createdAt', 'DESC')
        .skip((dto.page - 1) * 10)
        .take(10)
        .getRawMany()

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        data: postList,
        message: ''
      }
    } catch (err) {
      Logger.error(`[ERROR / getAllPostList 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 리스트 조회(카테고리 지정)
  async getPostList(dto: GetPostListDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const postList = await queryRunner.manager
        .getRepository(Post)
        .createQueryBuilder('p')
        .select([
          'p.id as id',
          'p.netTime as netTime',
          'p.content as content',
          'p.createdAt as createdAt',

          `IFNULL(
            concat('${await this.globalService.getGlobal(
              'imageDomain'
            )}', '/', f.enc_name),
          null) as imageUrl`
        ])
        .leftJoin(File, 'f', 'p.image = f.id')
        .where('p.categoryId = :categoryId and p.deletedAt is null', {
          categoryId: dto.categoryId
        })
        .orderBy('p.createdAt', 'DESC')
        .skip((dto.page - 1) * 10)
        .take(10)
        .getRawMany()

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        data: postList,
        message: ''
      }
    } catch (err) {
      Logger.error(`[ERROR / getPostList 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 삭제
  async deletePost(dto: DeletePostDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const post = await queryRunner.manager.getRepository(Post).findOne({
        where: {
          id: dto.postId,
          userId: dto.userId,
          deletedAt: IsNull()
        },
        lock: {
          mode: 'pessimistic_write'
        }
      })

      if (!post) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '포스트가 존재하지 않습니다.'
        }
      }

      post.deletedAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(Post).save(post)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '포스트가 삭제되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR / deletePost 함수] dto = ${dto}`)
      Logger.error(`[ERROR / deletePost 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 좋아요 추가
  async addLikePost(dto: AddLikePostDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const post = await queryRunner.manager.getRepository(Post).findOne({
        where: {
          id: dto.postId,
          deletedAt: IsNull()
        },
        lock: {
          mode: 'pessimistic_write'
        }
      })

      if (!post) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '포스트가 존재하지 않습니다.'
        }
      }

      const postLike = await queryRunner.manager
        .getRepository(PostLike)
        .findOne({
          where: {
            userId: dto.userId,
            postId: dto.postId,
            deletedAt: IsNull()
          }
        })

      if (postLike) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '이미 좋아요를 누르셨습니다.'
        }
      }

      const newPostLike = new PostLike()
      newPostLike.userId = dto.userId
      newPostLike.postId = dto.postId
      newPostLike.createdAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(PostLike).save(newPostLike)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '좋아요가 추가되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR / addLikePost 함수] dto = ${dto}`)
      Logger.error(`[ERROR / addLikePost 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 좋아요 삭제
  async removeLikePost(dto: RemoveLikePostDto) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const postLike = await queryRunner.manager
        .getRepository(PostLike)
        .findOne({
          where: {
            userId: dto.userId,
            postId: dto.postId,
            deletedAt: IsNull()
          },
          lock: {
            mode: 'pessimistic_write'
          }
        })

      if (!postLike) {
        // rollback
        await queryRunner.rollbackTransaction()

        return {
          result: false,
          message: '좋아요가 존재하지 않습니다.'
        }
      }

      postLike.deletedAt = moment().format(DATE.DATETIME)

      await queryRunner.manager.getRepository(PostLike).save(postLike)

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        message: '좋아요가 삭제되었습니다.'
      }
    } catch (err) {
      Logger.error(`[ERROR / removeLikePost 함수] dto = ${dto}`)
      Logger.error(`[ERROR / removeLikePost 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }

  // ANCHOR 포스트 좋아요 리스트 조회
  async getLikePostList(dto: { postId: number }) {
    const queryRunner = this.datasource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()

    try {
      const likePostList = await queryRunner.manager
        .getRepository(PostLike)
        .createQueryBuilder('pl')
        .select([
          'u.username as username',
          'u.profileImage as profileImage',
          'u.account as account'
        ])
        .innerJoin(User, 'u', 'pl.userId = u.id')
        .where('pl.postId = :postId and pl.deletedAt is null', {
          postId: dto.postId
        })
        .orderBy('pl.createdAt', 'DESC')
        .getRawMany()

      // commit
      await queryRunner.commitTransaction()

      return {
        result: true,
        data: likePostList,
        message: ''
      }
    } catch (err) {
      Logger.error(`[ERROR / getLikePostList 함수] dto = ${dto}`)
      Logger.error(`[ERROR / getLikePostList 함수] ${err}`)

      // rollback
      await queryRunner.rollbackTransaction()

      // fail
      return {
        result: false,
        message: '알 수 없는 에러 발생'
      }
    } finally {
      // release
      await queryRunner.release()
    }
  }
}
