import { DataSourceOptions } from 'typeorm'

export interface Configuration {
  port: number
  database: DataSourceOptions
  sessionSecretKey: string
  tempPasswordSecretKey: string
  serviceMode: string
  serverIp: string
  serverUrl: string
  kakaoClientId: string
  kakaoRedirectUri: string
}
