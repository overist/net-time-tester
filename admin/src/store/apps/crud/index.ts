// ** Redux Imports
import { createAsyncThunk, createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Etc
import produce from 'immer'
import { getPaginationCount, getParamsFromForm } from 'src/utils'

interface ReduxType {
  getState: any
  dispatch: Dispatch<any>
}

export const initData = createAsyncThunk(
  'appCrud/initData',
  async (_, { getState, dispatch }: ReduxType) => {
    const crud = getState().crud
    const listAPI = crud.listAPI
    const searchForm = crud.searchForm
    const params = getParamsFromForm(searchForm)
    params['page'] = 1
    dispatch(setIsLoad(true))
    dispatch(setInitSearch(true))
    const { data: res } = await listAPI(params)
    if (res.statusCode === 200) {
      const data = res.data
      dispatch(
        setPagination({
          activePage: 1,
          count: getPaginationCount(data.count, params['limit']),
          data: data.data,
          info: data.info
        })
      )
      dispatch(setIsLoad(false))
    }
  }
)

export const appCrudSlice = createSlice({
  name: 'appCrud',
  initialState: {
    // action id
    actionId: 0,

    // init search
    initSearch: true,

    // pagination
    pagination: {
      count: 0,
      data: [],
      activePage: 1,
      info: []
    },

    // page header
    pageHeader: {
      title: '',
      subTitle: ''
    },

    // table header
    tableHeader: [],

    // add form
    addForm: [],

    // search form
    searchForm: [],

    // detail form
    detailForm: [],

    // action list
    actionList: [],

    // action form
    actionForm: [],

    // dashboard list
    dashboardList: [],

    // list API
    listAPI: null,
    isLoad: false, // listAPI가 로딩될 때 상태 (true: 로딩 O, false: 로딩 X)

    // create API
    createAPI: null,

    // detail API
    detailAPI: null,

    // delete API
    deleteAPI: null,

    // update API
    updateAPI: null,

    // load API
    loadAPI: null
  },
  reducers: {
    setActionId(state, action) {
      state.actionId = action.payload.actionId
    },
    setPagination(state, action) {
      state.pagination = action.payload
    },
    setPageHeader(state, action) {
      state.pageHeader = action.payload
    },
    setTableHeader(state, action) {
      state.tableHeader = action.payload
    },
    setAddForm(state, action) {
      state.addForm = action.payload
    },
    setSearchForm(state, action) {
      state.searchForm = action.payload
    },
    setDetailForm(state, action) {
      state.detailForm = action.payload
    },
    setActionList(state, action) {
      state.actionList = action.payload
    },
    setActionForm(state, action) {
      state.actionForm = action.payload
    },
    setDashboardList(state, action) {
      state.dashboardList = action.payload
    },
    initAddForm(state) {
      const nextState = produce(state.addForm, (draftState) => {
        draftState.map((item) => {
          item.value = ''
        })
      })
      state.addForm = nextState
    },
    updateAddForm(state, action) {
      const nextState = produce(state.addForm, (draftState) => {
        draftState.map((item) => {
          if (item.key === action.payload.key) {
            item.value = action.payload.value
          }
        })
      })
      state.addForm = nextState
    },
    updateActionForm(state, action) {
      const nextState = produce(state.actionForm, (draftState) => {
        draftState.map((item) => {
          if (item.key === action.payload.key) {
            item.value = action.payload.value
          }
        })
      })
      state.actionForm = nextState
    },
    initEditForm(state, action) {
      const nextState = produce(state.actionForm, (draftState) => {
        draftState.map((item) => {
          // 어드민 권한 로직
          if (item.key === 'level') {
            if (
              action.payload.isAdmin === 1 &&
              action.payload.isSystemAdmin === 1
            )
              item.value = 'SA'
            if (
              action.payload.isAdmin === 1 &&
              action.payload.isSystemAdmin === 0
            )
              item.value = 'A'
          } else item.value = action.payload[item.key]
        })
      })
      state.actionForm = nextState
    },
    initSearchForm(state) {
      const nextState = produce(state.searchForm, (draftState) => {
        draftState.map((item) => {
          if (item.key === 'limit') {
            item.value = 10
          } else {
            item.value = ''
          }
        })
      })
      state.searchForm = nextState
    },
    updateSearchForm(state, action) {
      const nextState = produce(state.searchForm, (draftState) => {
        draftState.map((item) => {
          if (item.key === action.payload.key) {
            item.value = action.payload.value
          }
        })
      })
      state.searchForm = nextState
    },
    initDashboard(state, action) {
      if (action.payload.item.type === 'count') {
        const nextState = produce(state.dashboardList, (draftState) => {
          draftState.map((item) => {
            if (item.key === action.payload.item.key) {
              item.value = action.payload.res.data
            }
          })
        })
        state.dashboardList = nextState
      } else if (action.payload.item.type === 'lineChart') {
        const nextState = produce(state.dashboardList, (draftState) => {
          draftState.map((item) => {
            if (item.key === action.payload.item.key) {
              item.xAxis = action.payload.res.data.xAxis
              item.yAxis = action.payload.res.data.yAxis
            }
          })
        })
        state.dashboardList = nextState
      }
    },
    setListAPI(state, action) {
      state.listAPI = action.payload
    },
    setCreateAPI(state, action) {
      state.createAPI = action.payload
    },
    setDetailAPI(state, action) {
      state.detailAPI = action.payload
    },
    setDeleteAPI(state, action) {
      state.deleteAPI = action.payload
    },
    setUpdateAPI(state, action) {
      state.updateAPI = action.payload
    },
    setLoadAPI(state, action) {
      state.loadAPI = action.payload
    },
    setIsLoad(state, action) {
      state.isLoad = action.payload
    },
    setInitSearch(state, action) {
      state.initSearch = action.payload
    }
  }
})

export const {
  setActionId,
  setPagination,
  setTableHeader,
  setPageHeader,
  setAddForm,
  setSearchForm,
  setDetailForm,
  setActionList,
  setActionForm,
  setDashboardList,
  initAddForm,
  updateAddForm,
  updateActionForm,
  initEditForm,
  initSearchForm,
  initDashboard,
  updateSearchForm,
  setListAPI,
  setCreateAPI,
  setDetailAPI,
  setDeleteAPI,
  setUpdateAPI,
  setLoadAPI,
  setIsLoad,
  setInitSearch
} = appCrudSlice.actions

export default appCrudSlice.reducer
