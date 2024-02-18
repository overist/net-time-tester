// ** Module
import { useDispatch } from 'react-redux'

// ** Core
import HeaderContainer from 'src/components/core/header-container'
import ListContainer from 'src/components/core/list-container'
import Content from 'src/components/service/content'

// ** API
import {
  getServiceDetail,
  getServiceInfoList,
  updateServiceDetail
} from 'src/apis/service'

// ** Redux
import {
  setPageHeader,
  setTableHeader,
  setAddForm,
  setSearchForm,
  setDetailForm,
  setListAPI,
  setActionList,
  initData
} from 'src/store/apps/crud'
import { useEffect } from 'react'
import { AppDispatch } from 'src/store'

const Service = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // NOTE 리스트 조회 API 정의
    dispatch(setListAPI(getServiceInfoList))

    // NOTE 페이지 헤더 정의
    dispatch(
      setPageHeader({
        title: '서비스 관리',
        subTitle: '서비스를 관리할 수 있습니다.'
      })
    )

    // NOTE 테이블 헤더 정의
    dispatch(setTableHeader(['아이디', '타입', '언어', '내용', '액션']))

    // NOTE 추가 폼 설정
    dispatch(setAddForm([]))

    // NOTE 상세 폼 설정
    dispatch(setDetailForm([]))

    // NOTE 검색 폼 설정
    dispatch(
      setSearchForm([
        {
          type: 'date',
          label: '생성일자',
          key: 'createdAt',
          value: ''
        }
      ])
    )

    // NOTE 액션 정의
    dispatch(
      setActionList([
        {
          icon: 'material-symbols:edit',
          label: '내용 수정',
          content: [
            {
              type: 'editor',
              label: '내용 수정',
              key: 'content',
              value: ''
            }
          ],
          loadAPI: getServiceDetail,
          updateAPI: updateServiceDetail
        }
      ])
    )

    dispatch(initData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {/* 헤더 컨테이너 */}
      <HeaderContainer />

      {/* 리스트 컨테이너 */}
      <ListContainer>
        <Content />
      </ListContainer>
    </>
  )
}

export default Service
