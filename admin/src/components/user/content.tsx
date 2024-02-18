import moment from 'moment'
import { useState } from 'react'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import DATE from 'src/common/constants/date'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import ActionContainer from '../core/action-container'
import BigNumber from 'bignumber.js'
import Tooltip from '@mui/material/Tooltip'
import {
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import CustomCloseButton from '../custom-close-button'
import Icon from 'src/@core/components/icon'
import { comma } from 'src/utils'

const Content = () => {
  // ** Hooks
  const crud = useSelector((state: RootState) => state.crud)
  const pagination = crud.pagination

  const [state, setState] = useState({
    openSnack: false,
    snackContent: ''
  })

  const [openImageModal, setOpenImageModal] = useState(false)
  const [imageUrl, setImageUrl] = useState('')

  const { openSnack, snackContent } = state

  const handleClickSnack = (password: string) => {
    setState({
      openSnack: true,
      snackContent: password
    })
  }

  const handleCloseSnack = () => {
    setState({ ...state, openSnack: false })
  }

  const handleClickOpenImageModal = (url: string) => {
    setOpenImageModal(true)
    setImageUrl(url)
  }

  const handleClickCloseImageModal = () => {
    setOpenImageModal(false)
  }

  return (
    <>
      <TableBody>
        {pagination.data.map((row: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="no-wrap">
              <ActionContainer
                id={row.id}
                detailAction={false}
                deleteAction={true}
              />
            </TableCell>
            <TableCell className="no-wrap">{row.id ?? '-'}</TableCell>
            <TableCell className="no-wrap">{row.account ?? '-'}</TableCell>
            <TableCell className="no-wrap">{row.username ?? '-'}</TableCell>
            <TableCell className="no-wrap">
              {row.isBan && row.isBan === 1 ? (
                <Chip label="밴" color="error" />
              ) : (
                <Chip label="정상" color="primary" />
              )}
            </TableCell>
            <TableCell className="no-wrap">
              {row?.createdAt
                ? moment(row?.createdAt).format(DATE.DATETIME)
                : '-'}
            </TableCell>
            <TableCell className="no-wrap">
              {row?.updatedAt
                ? moment(row?.updatedAt).format(DATE.DATETIME)
                : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>

      <Snackbar
        open={openSnack}
        onClose={handleCloseSnack}
        message={snackContent}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      />
      <Dialog
        open={openImageModal}
        onClose={() => {
          handleClickCloseImageModal()
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">이미지</DialogTitle>
        <CustomCloseButton
          size="small"
          aria-label="close"
          onClick={() => {
            handleClickCloseImageModal()
          }}
        >
          <Icon icon="bx:x" />
        </CustomCloseButton>
        <DialogContent style={{ minWidth: '300px' }}>
          <CustomAvatar
            src={imageUrl}
            variant="rounded"
            sx={{ width: '100%', height: '100%' }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Content
