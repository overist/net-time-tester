// ** Module
import { useDispatch } from 'react-redux'

// ** Core
import HeaderContainer from 'src/components/core/header-container'
import SearchContainer from 'src/components/core/search-container'
import ListContainer from 'src/components/core/list-container'
import Content from 'src/components/user/content'

// ** API
import {
  deleteUser,
  getUserDetail,
  getUserList,
  updateUserDetail,
  updateUserIsBan
} from 'src/apis/admin'

// ** Redux
import {
  setPageHeader,
  setTableHeader,
  setAddForm,
  setSearchForm,
  setDetailForm,
  setListAPI,
  setActionList,
  initData,
  setDeleteAPI
} from 'src/store/apps/crud'
import { useEffect } from 'react'
import { AppDispatch } from 'src/store'
import InfoContainer from 'src/components/core/info-container'

const User = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    const loadData = async () => {
      // NOTE 리스트 조회 API 정의
      dispatch(setListAPI(getUserList))

      // NOTE 삭제 API 정의
      dispatch(setDeleteAPI(deleteUser))

      // NOTE 페이지 헤더 정의
      dispatch(
        setPageHeader({
          title: '사용자 관리',
          subTitle: '사용자를 관리할 수 있습니다.'
        })
      )

      // NOTE 테이블 헤더 정의
      dispatch(
        setTableHeader([
          '액션',
          '번호',
          '아이디',
          '사용자명',
          '밴여부',
          '생성일자',
          '수정일자'
        ])
      )

      // NOTE 추가 폼 설정
      dispatch(setAddForm([]))

      // NOTE 상세 폼 설정
      dispatch(setDetailForm([]))

      // NOTE 검색 폼 설정
      dispatch(
        setSearchForm([
          {
            type: 'text',
            label: '번호',
            key: 'userId',
            value: ''
          },
          {
            type: 'text',
            label: '아이디',
            key: 'account',
            value: ''
          },
          {
            type: 'text',
            label: '사용자명',
            key: 'username',
            value: ''
          },

          {
            type: 'date',
            label: '생성일자 (시작)',
            key: 'createdStartAt',
            value: ''
          },
          {
            type: 'date',
            label: '생성일자 (종료)',
            key: 'createdEndAt',
            value: ''
          },
          {
            type: 'number',
            label: '페이지개수',
            key: 'limit',
            value: 10
          }
        ])
      )

      // NOTE 액션 정의
      dispatch(
        setActionList([
          {
            icon: 'bx:user-circle',
            label: '기본정보 수정',
            content: [
              {
                type: 'text',
                label: '계정',
                key: 'account',
                value: ''
              },
              {
                type: 'text',
                label: '닉네임',
                key: 'username',
                value: ''
              }
            ],
            loadAPI: getUserDetail,
            updateAPI: updateUserDetail
          },
          {
            icon: 'bx:pencil',
            label: '유저 밴 상태 변경',
            content: [
              {
                type: 'select',
                label: '유저 밴 상태변경',
                key: 'isBan',
                value: '',
                list: [
                  {
                    label: '유저 밴(접근차단)',
                    value: 1
                  },
                  {
                    label: '정상유저(밴 해제)',
                    value: 0
                  }
                ]
              }
            ],
            loadAPI: getUserDetail,
            updateAPI: updateUserIsBan
          }
        ])
      )

      dispatch(initData())
    }
    loadData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* 헤더 컨테이너 */}
      <HeaderContainer />

      {/* 검색 컨테이너 */}
      <SearchContainer />

      {/* 정보 컨테이너 */}
      <InfoContainer />

      {/* 리스트 컨테이너 */}
      <ListContainer>
        <Content />
      </ListContainer>
    </>
  )
}

export default User
