// ** React Imports
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  ReactNode,
  useEffect,
  useState
} from 'react'

// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import OutlinedInput from '@mui/material/OutlinedInput'
import { useTheme } from '@mui/material/styles'
import InputAdornment from '@mui/material/InputAdornment'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import AuthIllustrationWrapper from 'src/views/pages/auth/AuthIllustrationWrapper'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useAuth } from 'src/hooks/useAuth'
import { checkSystemAdmin } from 'src/apis/admin'
import FormHeader from 'src/components/form-header'
import { getAuthInfo, login } from 'src/apis/auth'

interface State {
  email: string
  password: string
  showPassword: boolean
}

const LoginV1 = () => {
  // ** State
  const [values, setValues] = useState<State>({
    email: '',
    password: '',
    showPassword: false
  })

  // ** Hook
  const { setUser } = useAuth()
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation()

  const handleChange =
    (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value })
    }

  // 비밀번호
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }
  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleClickAction = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const params = {
        account: values.email,
        password: values.password
      }
      const { data: res } = await login(params)
      if (res.statusCode === 200) {
        const { data: res } = await getAuthInfo()
        if (res.statusCode === 200) {
          setUser({ ...res.data })
          const returnUrl = router.query.returnUrl
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        }
      }
    } catch (err: any) {
      toast.error(t(err.response.data.message))
    }
  }

  const initData = async () => {
    const { data: res } = await checkSystemAdmin()
    if (res.statusCode === 200) {
      if (res.data) {
        router.push('/auth/init')
      }
    }
  }

  useEffect(() => {
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Box className="content-center">
      <AuthIllustrationWrapper>
        <Card>
          <CardContent sx={{ p: `${theme.spacing(8, 8, 7)} !important` }}>
            <FormHeader />
            <form
              noValidate
              autoComplete="off"
              onSubmit={(e) => handleClickAction(e)}
            >
              <TextField
                size="small"
                autoFocus
                fullWidth
                id="email"
                label="이메일 (계정)"
                sx={{ mb: 4 }}
                onChange={handleChange('email')}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel
                  htmlFor="auth-login-password"
                  style={{ top: '-6px' }}
                >
                  비밀번호
                </InputLabel>
                <OutlinedInput
                  size="small"
                  label="Password"
                  value={values.password}
                  id="auth-login-password"
                  onChange={handleChange('password')}
                  type={values.showPassword ? 'text' : 'password'}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        edge="end"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        aria-label="toggle password visibility"
                      >
                        <Icon
                          fontSize={20}
                          icon={values.showPassword ? 'bx:show' : 'bx:hide'}
                        />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{ mt: 5 }}
              >
                로그인
              </Button>
            </form>
          </CardContent>
        </Card>
      </AuthIllustrationWrapper>
    </Box>
  )
}

LoginV1.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

LoginV1.guestGuard = true

export default LoginV1
