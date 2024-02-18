// ** MUI Components
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'

// ** Configs
import { AppDispatch, RootState } from 'src/store'

// ** Custom
import Logo from './logo'

const FormHeader = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()
  const app = useSelector((state: RootState) => state.app)

  const initData = async () => {
    // try {
    //   const { data: res } = await getAppInfo()
    //   if (res.statusCode === 200) {
    //     dispatch(setAppInfo(res.data))
    //   }
    // } catch (err) {
    //   //
    // }
  }

  // 환경변수
  const env: any = process.env.NEXT_PUBLIC_APP_ENV

  useEffect(() => {
    initData()
  }, [])

  return (
    <>
      <Box>
        {env === 'development' && (
          <>
            <Typography variant="h6" textAlign={'center'}>
              DEVELOPMENT
            </Typography>
          </>
        )}
        {env === 'stage' && (
          <>
            <Typography variant="h6" textAlign={'center'}>
              STAGE
            </Typography>
          </>
        )}
      </Box>
      <Box display="flex" justifyContent={'center'} sx={{ mb: 5 }}>
        <Logo width={180} path={'/images/logo.png'} />
      </Box>
    </>
  )
}

export default FormHeader
