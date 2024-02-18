import axios from 'axios'
import { CommonResponse } from 'src/common/interface'

const rootUrl = '/api/admin/'

// ANCHOR check system admin
export const checkSystemAdmin = () => {
  const url = `${rootUrl}checkSystemAdmin`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR create system admin
export const createSystemAdmin = (params: object) => {
  const url = `${rootUrl}createSystemAdmin`
  const response = axios.post<CommonResponse>(url, params)

  return response
}

// ANCHOR get admin list
export const getAdminList = (params: object) => {
  const url = `${rootUrl}getAdminList`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR get admin detail
export const getAdminDetail = (params: object) => {
  const url = `${rootUrl}getAdminDetail`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR create admin
export const createAdmin = (params: object) => {
  const url = `${rootUrl}createAdmin`
  const response = axios.post<CommonResponse>(url, params)

  return response
}

// ANCHOR delete admin
export const deleteAdmin = (params: object) => {
  const url = `${rootUrl}deleteAdmin`
  const response = axios.delete<CommonResponse>(url, { params })

  return response
}

// ANCHOR update admin password
export const updateAdminPassword = (params: object) => {
  const url = `${rootUrl}updateAdminPassword`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR update admin username
export const updateAdminUsername = (params: object) => {
  const url = `${rootUrl}updateAdminUsername`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR update admin level
export const updateAdminLevel = (params: object) => {
  const url = `${rootUrl}updateAdminLevel`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR update admin profile
export const updateAdminProfile = (params: object) => {
  const url = `${rootUrl}updateAdminProfile`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR update admin intro
export const updateAdminIntro = (params: object) => {
  const url = `${rootUrl}updateAdminIntro`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR get login history admin list
export const getLoginHistoryAdminList = (params: object) => {
  const url = `${rootUrl}getLoginHistoryAdminList`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR get user list
export const getUserList = (params: object) => {
  const url = `${rootUrl}getUserList`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR get user detail
export const getUserDetail = (params: object) => {
  const url = `${rootUrl}getUserDetail`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR update user detail
export const updateUserDetail = (params: object) => {
  const url = `${rootUrl}updateUserDetail`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR get login history user list
export const getLoginHistoryUserList = (params: object) => {
  const url = `${rootUrl}getLoginHistoryUserList`
  const response = axios.get<CommonResponse>(url, { params })

  return response
}

// ANCHOR update user is ban
export const updateUserIsBan = (params: object) => {
  const url = `${rootUrl}updateUserIsBan`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR update user lock
export const updateUserLock = (params: object) => {
  const url = `${rootUrl}updateUserLock`
  const response = axios.put<CommonResponse>(url, params)

  return response
}

// ANCHOR delete user
export const deleteUser = (params: object) => {
  const url = `${rootUrl}deleteUser`
  const response = axios.post<CommonResponse>(url, params)

  return response
}
