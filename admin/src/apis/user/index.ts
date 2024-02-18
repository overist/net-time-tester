import axios from 'axios'
import { CommonResponse } from 'src/common/interface'

const rootUrl = '/api/user/'

// ANCHOR register
export const register = (params: object) => {
  const url = `${rootUrl}register`
  const response = axios.post<CommonResponse>(url, params)

  return response
}
