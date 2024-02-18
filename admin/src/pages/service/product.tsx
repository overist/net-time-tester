// ** Module
import { useDispatch } from 'react-redux'

// ** Core
import HeaderContainer from 'src/components/core/header-container'
import SearchContainer from 'src/components/core/search-container'
import ListContainer from 'src/components/core/list-container'
import Content from 'src/components/service/product/content'

// ** API
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProductList,
  updateProduct
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
  setDeleteAPI,
  setLoadAPI
} from 'src/store/apps/crud'
import { useEffect } from 'react'
import { AppDispatch } from 'src/store'
import AddContainer from 'src/components/core/add-container'

const Product = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    // NOTE 리스트 조회 API 정의
    dispatch(setListAPI(getProductList))

    // NOTE 생성 API 정의
    dispatch(setCreateAPI(createProduct))

    // NOTE 삭제 API 정의
    dispatch(setDeleteAPI(deleteProduct))

    // NOTE 수정 모달 로드 API 정의
    dispatch(setLoadAPI(getProduct))

    // NOTE 페이지 헤더 정의
    dispatch(
      setPageHeader({
        title: '상품 관리',
        subTitle: '상품을 관리할 수 있습니다.'
      })
    )

    // NOTE 테이블 헤더 정의
    dispatch(
      setTableHeader([
        '아이디',
        '상품명',
        '상품내용',
        '이미지',
        '가격',
        '정렬순서',
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
          label: '상품명',
          key: 'title',
          value: ''
        },
        {
          type: 'editor',
          label: '상품내용',
          key: 'content',
          value: ''
        },
        {
          type: 'upload',
          label: '이미지',
          key: 'image',
          value: [],
          allowFileExt: ['.png', '.jpg', '.jpeg', '.gif'],
          maxFileCount: 1,
          maxFileSizeBytes: 1024 * 1024 * 4
        },
        {
          type: 'text',
          label: '가격',
          key: 'price',
          value: ''
        },
        {
          type: 'text',
          label: '정렬순서',
          key: 'sortNo',
          value: ''
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
          label: '상품명',
          key: 'title',
          value: ''
        },
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
          icon: 'bx:pencil',
          label: '상품 수정',
          content: [
            {
              type: 'text',
              label: '상품명',
              key: 'title',
              value: ''
            },
            {
              type: 'editor',
              label: '상품내용',
              key: 'content',
              value: ''
            },
            {
              type: 'upload',
              label: '이미지',
              key: 'image',
              value: [],
              allowFileExt: ['.png', '.jpg', '.jpeg', '.gif'],
              maxFileCount: 1,
              maxFileSizeBytes: 1024 * 1024 * 4
            },
            {
              type: 'text',
              label: '가격',
              key: 'price',
              value: ''
            },
            {
              type: 'text',
              label: '정렬순서',
              key: 'sortNo',
              value: ''
            }
          ],
          loadAPI: getProduct,
          updateAPI: updateProduct
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

      {/* 리스트 컨테이너 */}
      <ListContainer>
        <Content />
      </ListContainer>
    </>
  )
}

export default Product
