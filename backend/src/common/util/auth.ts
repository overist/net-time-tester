import bcrypt from 'bcrypt'

// ANCHOR create password
export const createPassword = async (password: string): Promise<string> => {
  const saltOrRounds = 10
  const hash = await bcrypt.hash(password, saltOrRounds)
  return hash
}

// ANCHOR match password
export const isMatch = async (
  password: string,
  hash: string
): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hash)
  return isMatch
}

// ANCHOR bytes formatting
export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes <= 0) return '0Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))}${sizes[i]}`
}

// ANCHOR 인증번호 생성 (숫자 6자리)
export const createAuthNumber = (): string => {
  const authNumber = [...new Array(6)].reduce(
    (a) => a.concat(String(Math.floor(Math.random() * 10))),
    ''
  )

  return authNumber
}

// ANCHOR 비밀번호 발급 (기본: 10자리)
export const generatePassword = (length = 10) => {
  // 생성할 비밀번호의 길이
  length = length || 10

  // 사용할 문자열
  const charset =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

  // 랜덤 문자열 생성
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }

  return password
}
