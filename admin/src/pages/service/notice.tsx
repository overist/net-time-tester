// ** Module
import { useDispatch } from 'react-redux'

// ** Core
import HeaderContainer from 'src/components/core/header-container'
import SearchContainer from 'src/components/core/search-container'
import ListContainer from 'src/components/core/list-container'
import Content from 'src/components/service/notice/content'

// ** API
import {
  createNotice,
  deleteNotice,
  getNotice,
  getNoticeList,
  updateNotice
} from 'src/apis/admin'

// ** Redux
import {
  setPageHeader,
  setTableHeader,
  setSearchForm,
  setDetailForm,
  setListAPI,
  setActionList,
  initData,
  setAddForm,
  setCreateAPI,
  setDetailAPI,
  setDeleteAPI,
  setLoadAPI
} from 'src/store/apps/crud'
import { useEffect } from 'react'
import { AppDispatch } from 'src/store'
import AddContainer from 'src/components/core/add-container'
import InfoContainer from 'src/components/core/info-container'

const Notice = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // NOTE 리스트 조회 API 정의
    dispatch(setListAPI(getNoticeList))

    // NOTE 생성 API 정의
    dispatch(setCreateAPI(createNotice))

    // NOTE 상세 API 정의
    dispatch(setDetailAPI(null))

    // NOTE 삭제 API 정의
    dispatch(setDeleteAPI(deleteNotice))

    // NOTE 수정 모달 로드 API 정의
    dispatch(setLoadAPI(getNotice))

    // NOTE 페이지 헤더 정의
    dispatch(
      setPageHeader({
        title: '공지사항 관리',
        subTitle: '공지사항을 관리할 수 있습니다.'
      })
    )

    // NOTE 테이블 헤더 정의
    dispatch(
      setTableHeader([
        '아이디',
        '제목',
        '내용',
        '조회수',
        '팝업 유무',
        '관리자아이디',
        '관리자계정',
        '관리자명',
        '생성일자',
        '수정일자',
        '액션'
      ])
    )

    // NOTE 추가 폼 설정
    dispatch(
      setAddForm([
        {
          type: 'text',
          label: '제목',
          key: 'title',
          value: ''
        },
        {
          type: 'editor',
          label: '내용',
          key: 'content',
          value: ''
        },
        {
          type: 'select',
          label: '팝업 유무',
          key: 'isPopup',
          value: '',
          list: [
            {
              label: '일반',
              value: 0
            },
            {
              label: '팝업',
              value: 1
            }
          ]
        }
      ])
    )

    // NOTE 상세 폼 설정
    dispatch(setDetailForm([]))

    // NOTE 검색 폼 설정
    dispatch(
      setSearchForm([
        {
          type: 'text',
          label: '제목',
          key: 'title',
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
          icon: 'bx:pencil',
          label: '공지사항 수정',
          content: [
            {
              type: 'text',
              label: '제목',
              key: 'title',
              value: ''
            },
            {
              type: 'editor',
              label: '내용',
              key: 'content',
              value: ''
            },
            {
              type: 'select',
              label: '팝업 유무',
              key: 'isPopup',
              value: '',
              list: [
                {
                  label: '일반',
                  value: 0
                },
                {
                  label: '팝업',
                  value: 1
                }
              ]
            }
          ],
          loadAPI: getNotice,
          updateAPI: updateNotice
        }
      ])
    )

    dispatch(initData())
  }, [])

  return (
    <>
      {/* 헤더 컨테이너 */}
      <HeaderContainer />

      {/* 추가 컨테이너 */}
      <AddContainer />

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

export default Notice
