import axios from 'axios'
import { CommonResponse } from 'src/common/interface'

const rootUrl = '/api/dashboard/'

// ANCHOR get admin count
export const getAdminCount = () => {
  const url = `${rootUrl}getAdminCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get login history admin count
export const getLoginHistoryAdminCount = () => {
  const url = `${rootUrl}getLoginHistoryAdminCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get user count
export const getUserCount = () => {
  const url = `${rootUrl}getUserCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get login history count
export const getLoginHistoryCount = () => {
  const url = `${rootUrl}getLoginHistoryCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get image count
export const getImageCount = () => {
  const url = `${rootUrl}getImageCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get setting count
export const getSettingCount = () => {
  const url = `${rootUrl}getSettingCount`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get user line chart
export const getUserLineChart = () => {
  const url = `${rootUrl}getUserLineChart`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get login history line chart
export const getLoginHistoryLineChart = () => {
  const url = `${rootUrl}getLoginHistoryLineChart`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get image line chart
export const getImageLineChart = () => {
  const url = `${rootUrl}getImageLineChart`
  const response = axios.get<CommonResponse>(url)

  return response
}

// ANCHOR get setting line chart
export const getSettingLineChart = () => {
  const url = `${rootUrl}getSettingLineChart`
  const response = axios.get<CommonResponse>(url)

  return response
}
