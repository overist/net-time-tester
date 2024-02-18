export interface Result {
  result: boolean
  message: string
  data?: any
}

export interface CommonResult {
  message: string
  data?: any
}

export interface Rate {
  rate: string
  code: string
  daysDiff: number | null
}

export interface position {
  x: number
  y: number
}

export interface data {
  label: string
}

export interface node {
  id: string
  position: position
  data: data
}

export interface edge {
  id: string
  source: string
  target: string
}

export interface Structure {
  nodes: node[]
  edges: edge[]
}

export interface TempPasswordToken {
  account: string
  tempPassword: string
  expired: string
}
