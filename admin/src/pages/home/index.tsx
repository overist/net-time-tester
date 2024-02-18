// ** MUI Imports
import Grid from '@mui/material/Grid'

// ** Styled Component Import
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

// ** Demo Component Imports
import { useEffect } from 'react'
import Congratulations from 'src/components/congratulations'
import CardStatsVertical from 'src/components/card-stats-vertical'
import {
  getAdminCount,
  getLoginHistoryAdminCount,
  getUserCount
} from 'src/apis/dashboard'
import { useDispatch, useSelector } from 'react-redux'

// ** Redux
import { initDashboard, setDashboardList } from 'src/store/apps/crud'
import { RootState } from 'src/store'
import ApexLineChart from 'src/components/apex-line-chart'

const Home = () => {
  const dispatch = useDispatch()
  const crud = useSelector((state: RootState) => state.crud)
  const dashboardList = crud.dashboardList

  useEffect(() => {
    // NOTE 대쉬보드 리스트
    dispatch(
      setDashboardList([
        {
          type: 'count',
          key: 'admin',
          image: '/images/custom/admin.png',
          title: '관리자',
          value: {
            total: 0,
            today: 0,
            diff: 0
          },
          loadAPI: getAdminCount
        },
        {
          type: 'count',
          key: 'loginHistoryAdmin',
          image: '/images/custom/history.png',
          title: '관리자 로그인 이력',
          value: {
            total: 0,
            today: 0,
            diff: 0
          },
          loadAPI: getLoginHistoryAdminCount
        },
        {
          type: 'count',
          key: 'user',
          image: '/images/custom/user.png',
          title: '사용자',
          value: {
            total: 0,
            today: 0,
            diff: 0
          },
          loadAPI: getUserCount
        }
      ])
    )
  }, [])

  useEffect(() => {
    initData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardList.length])

  const initData = () => {
    dashboardList.map(async (item) => {
      const { data: res } = await item.loadAPI()
      dispatch(initDashboard({ item, res }))
    })
  }

  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} md={12} lg={12} sx={{ order: -1 }}>
            <Congratulations />
          </Grid>
          {dashboardList.map((item, idx) => {
            return (
              <>
                {item.type === 'count' && (
                  <Grid key={idx} item xs={6} md={6} lg={2} sx={{ order: -1 }}>
                    <CardStatsVertical
                      key={idx}
                      image={item.image}
                      title={item.title}
                      total={item.value.total}
                      today={item.value.today}
                      diff={item.value.diff}
                    />
                  </Grid>
                )}
                {item.type === 'lineChart' && (
                  <Grid key={idx} item xs={6} md={6} lg={6} sx={{ order: -1 }}>
                    <ApexLineChart
                      key={idx}
                      title={item.title}
                      color={item.color}
                      symbol={item.symbol}
                      height={item.height}
                      xAxis={item.xAxis}
                      yAxis={item.yAxis}
                    />
                  </Grid>
                )}
              </>
            )
          })}
        </Grid>
      </ApexChartWrapper>
    </>
  )
}

export default Home
