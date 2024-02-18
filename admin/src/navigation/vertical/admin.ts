// ** Type import
import { VerticalNavItemsType } from 'src/@core/layouts/types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      sectionTitle: '대시보드'
    },
    {
      title: '대시보드',
      icon: 'bx:home',
      path: '/home'
    }
  ]
}

export default navigation
