export const getPaginationCount = (count: number, limit: number) => {
  const res = Math.ceil(count / limit)

  return res
}

export const getParamsFromForm = (form) => {
  const params = {}
  for (let i = 0; i < form.length; i++) {
    const item = form[i]
    params[item.key] = item.value
  }

  return params
}

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export const numberWithCommas = (x: number) => {
  try {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  } catch (err) {
    return '에러'
  }
}

export const comma = (x) => {
  if (!x) return 0

  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
