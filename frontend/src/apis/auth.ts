import axios from "axios";
import { CommonResponse } from "@/common/interface";

const rootUrl = "/api/main/";

// ANCHOR login
export const loginKakao = (params: object) => {
  const url = `${rootUrl}loginKakao`;
  const response = axios.post<CommonResponse>(url, params);

  return response;
};

// ANCHOR get user
export const getUser = () => {
  const url = `${rootUrl}getUser`;
  const response = axios.get<CommonResponse>(url);

  return response;
};

// ANCHOR get sys info
export const getSysInfo = () => {
  const url = `${rootUrl}getSysInfo`;
  const response = axios.get<CommonResponse>(url);

  return response;
};

// ANCHOR logout
export const logout = () => {
  const url = `${rootUrl}logout`;
  const response = axios.delete<CommonResponse>(url);

  return response;
};

// ANCHOR sign up
export const signUp = (params: object) => {
  const url = `${rootUrl}signUp`;
  const response = axios.post<CommonResponse>(url, params);

  return response;
};
