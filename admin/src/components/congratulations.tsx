// ** MUI Imports
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Grid, { GridProps } from '@mui/material/Grid'
import { styled, useTheme } from '@mui/material/styles'
import { useRouter } from 'next/router'

// Styled Grid component
const StyledGrid = styled(Grid)<GridProps>(({ theme }) => ({
  [theme.breakpoints.down('sm')]: {
    order: -1,
    display: 'flex',
    justifyContent: 'center'
  }
}))

// Styled component for the image
const Img = styled('img')(({ theme }) => ({
  right: 60,
  bottom: '-15px',
  height: 170,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    position: 'static'
  }
}))

const Congratulations = () => {
  // ** Hook
  const theme = useTheme()
  const router = useRouter()

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent sx={{ py: (theme) => `${theme.spacing(5)} !important` }}>
        <Grid container spacing={6}>
          <Grid item xs={12} sm={6} sx={{ textAlign: ['center', 'start'] }}>
            <Typography variant="h5" sx={{ mb: 4, color: 'primary.main' }}>
              세상에서 가장 트렌디한 마케팅 시스템
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              디자인은 심플해야 아름답습니다.
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              UI/UX는 사용자의 기능 및 편의성에 중점을 맞춰야합니다.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: 'text.secondary' }}>
              완벽한 관리자 솔루션이 탄생할 때 까지 노력하겠습니다.
            </Typography>
            {/* <Button
              size="small"
              variant="outlined"
              onClick={() => router.push('/settings/')}
            >
              키-값 설정 하러가기
            </Button> */}
          </Grid>
          <StyledGrid item xs={12} sm={6}>
            <Img
              alt="Congratulations John"
              src={`/images/cards/kaiwa_communication_business.png`}
            />
          </StyledGrid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Congratulations
