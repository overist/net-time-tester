// ** React Imports
import { ReactNode, ReactElement, useEffect } from 'react'

// ** Next Imports
import { useRouter } from 'next/router'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'
import { getAuthInfo } from 'src/apis/auth'

interface AuthGuardProps {
  children: ReactNode
  fallback: ReactElement | null
}

const AuthGuard = (props: AuthGuardProps) => {
  const { children, fallback } = props
  const auth = useAuth()
  const router = useRouter()
  const { setUser } = useAuth()

  const initData = async () => {
    // 세션 기반으로 로그인 정보 조회
    try {
      const { data: res } = await getAuthInfo()
      if (res.statusCode === 200) {
        setUser({ role: 'admin', ...res.data })
      }
    } catch (err) {
      // 세션 기반으로 로그인 정보가 없을 경우 로그인 페이지 전환
      if (router.asPath !== '/') {
        router.replace({
          pathname: '/auth/login',
          query: { returnUrl: router.asPath }
        })
      } else {
        router.replace('/auth/login')
      }
    }
  }

  useEffect(
    () => {
      initData()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [router.route]
  )

  if (auth.loading || auth.user === null) {
    return fallback
  }

  return <>{children}</>
}

export default AuthGuard
