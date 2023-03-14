// ** React Imports
import { useState, useEffect } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import TabContext from '@mui/lab/TabContext'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Demo Tabs Imports
import TabMenuBuilder from 'src/components/builder/menu'
import { getGlobalList } from 'src/apis/global'
import { Button } from '@mui/material'
import { hOpenAddForm, hSetActiveTab, reloadMenu } from 'src/store/apps/menu'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/store'
import { updateMenu } from 'src/apis/menu'
import toast from 'react-hot-toast'

const MenuContainer = () => {
  // ** Hooks
  const dispatch = useDispatch<AppDispatch>()

  // ** Redux
  const menu = useSelector((state: RootState) => state.menu)
  const { activeTab, updateMenuIdList } = menu

  // ** State
  const [tabs, setTabs] = useState<any>([])

  const initData = async () => {
    try {
      const { data: res } = await getGlobalList()
      if (res.statusCode === 200) {
        const role = JSON.parse(
          res.data.filter((global) => global.key === 'role')[0].value
        )
        dispatch(hSetActiveTab('U'))
        setTabs(role)
      }
    } catch (err) {
      //
    }
  }
  useEffect(() => {
    initData()
  }, [])

  // ** handler
  const handleTabChange = (e) => {
    dispatch(hSetActiveTab(e.target.value))
  }

  const handleClickSave = async () => {
    try {
      const params = {
        permission: activeTab,
        menuIdList: updateMenuIdList
      }

      const { data: res } = await updateMenu(params)
      if (res.statusCode === 200) {
        toast.success(res.message)
        dispatch(reloadMenu())
      }
    } catch (err) {
      //
    }
  }

  return (
    <>
      {/* 헤더 컨테이너 */}

      <Grid container spacing={6} sx={{ mt: 1 }}>
        <Grid item xs={12}>
          <TabContext value={activeTab}>
            <Grid container spacing={6}>
              <Grid item xs={12}>
                {Object.keys(tabs).map((tab) => (
                  <>
                    {tab === activeTab ? (
                      <Button
                        variant="contained"
                        value={tab}
                        startIcon={<Icon icon="bx:user" />}
                        sx={{ mr: 5 }}
                        onClick={handleTabChange}
                      >
                        {tabs[tab]}
                      </Button>
                    ) : (
                      <Button
                        variant="text"
                        color="secondary"
                        value={tab}
                        startIcon={<Icon icon="bx:user" />}
                        sx={{ mr: 5 }}
                        onClick={handleTabChange}
                      >
                        {tabs[tab]}
                      </Button>
                    )}
                  </>
                ))}
              </Grid>
              <Grid item xs={12} sx={{ textAlign: 'right' }}>
                <Button
                  variant="contained"
                  sx={{ mr: 5 }}
                  onClick={() => {
                    dispatch(hOpenAddForm())
                  }}
                >
                  메뉴 생성
                </Button>

                <Button
                  variant="contained"
                  sx={{ mr: 5 }}
                  onClick={handleClickSave}
                >
                  저장
                </Button>
              </Grid>

              <Grid item xs={12}>
                <TabMenuBuilder tabs={tabs} />
              </Grid>
            </Grid>
          </TabContext>
        </Grid>
      </Grid>
    </>
  )
}

export default MenuContainer
