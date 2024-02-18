// ** Redux Imports
import { createSlice, Dispatch } from '@reduxjs/toolkit'

// ** Etc

interface ReduxType {
  getState: any
  dispatch: Dispatch<any>
}

export const appAppSlice = createSlice({
  name: 'appApp',
  initialState: {
    // app logo
    appLogo: '',

    // app name
    appName: '',

    // app desc
    appDesc: '',

    // app type
    appType: '',

    // app unit
    appUnit: '',

    // app user extend
    appUserExt: ''
  },
  reducers: {
    setAppInfo(state, action) {
      state.appLogo = action.payload.appLogo
      state.appName = action.payload.appName
      state.appDesc = action.payload.appDesc
      state.appType = action.payload.appType
      state.appUnit = action.payload.appUnit
      state.appUserExt = action.payload.appUserExt
    }
  }
})

export const { setAppInfo } = appAppSlice.actions

export default appAppSlice.reducer
