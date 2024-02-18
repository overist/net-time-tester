import moment from 'moment'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Chip from '@mui/material/Chip'

import DATE from 'src/common/constants/date'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

const Content = () => {
  // ** Hooks
  const crud = useSelector((state: RootState) => state.crud)
  const pagination = crud.pagination

  return (
    <>
      <TableBody>
        {pagination.data.map((row: any, idx: number) => (
          <TableRow key={idx}>
            <TableCell className="no-wrap">{row.id}</TableCell>
            <TableCell className="no-wrap">{row.userId}</TableCell>
            <TableCell className="no-wrap">{row.account}</TableCell>
            <TableCell className="no-wrap">{row.username}</TableCell>
            <TableCell className="no-wrap">
              {row.type === 1 ? (
                <Chip label="로그인" color="primary" variant="outlined" />
              ) : (
                <Chip label="로그아웃" color="error" variant="outlined" />
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
    </>
  )
}

export default Content
