// ** MUI Imports
import Card from '@mui/material/Card'
import { useTheme } from '@mui/material/styles'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports

// ** Third Party Imports
import { ApexOptions } from 'apexcharts'

// ** Custom Components Imports
import ReactApexcharts from 'src/@core/components/react-apexcharts'

const ApexLineChart = ({ title, color, symbol, xAxis, yAxis, height }) => {
  // ** Hook
  const theme = useTheme()

  const series = [
    {
      data: yAxis
    }
  ]

  const formatNumber = (number) => {
    // 콤마로 포맷팅된 문자열 반환
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  const options: ApexOptions = {
    chart: {
      parentHeightOffset: 0,
      zoom: { enabled: false },
      toolbar: { show: false }
    },
    colors: [color],
    stroke: { curve: 'straight' },
    dataLabels: { enabled: false },
    markers: {
      strokeWidth: 7,
      strokeOpacity: 1,
      colors: [color],
      strokeColors: ['#fff']
    },
    grid: {
      padding: { top: -20 },
      borderColor: theme.palette.divider,
      xaxis: {
        lines: { show: true }
      }
    },
    tooltip: {
      custom(data: any) {
        const formattedValue = formatNumber(
          data.series[data.seriesIndex][data.dataPointIndex]
        )

        return `<div class='bar-chart' style="padding: 15px">
          <span>${formattedValue}${symbol}</span>
        </div>`
      }
    },
    yaxis: {
      labels: {
        style: { colors: theme.palette.text.disabled }
      }
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { color: theme.palette.divider },
      crosshairs: {
        stroke: { color: theme.palette.divider }
      },
      labels: {
        style: { colors: theme.palette.text.disabled }
      },
      categories: xAxis
    }
  }

  return (
    <Card>
      <CardHeader title={title} />
      <CardContent>
        <ReactApexcharts
          type="line"
          height={height}
          options={options}
          series={series}
        />
      </CardContent>
    </Card>
  )
}

export default ApexLineChart
