import produce from 'immer'
import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'
import Stack from '@mui/material/Stack'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Button from '@mui/material/Button'
import AddConfirmModal from 'src/components/core/add-confirm-modal'

const AddModal = ({
  openModal,
  handleClickCloseModal,
  addForm,
  setAddForm
}) => {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const handleClickOpenConfirmModal = () => setOpenConfirmModal(true)
  const handleClickCloseConfirmModal = () => setOpenConfirmModal(false)
  const handleChangeForm = (key: string, value: string) => {
    const nextState = produce(addForm, (draftState) => {
      draftState.map((item) => {
        if (item.key === key) {
          item.value = value
        }
      })
    })
    setAddForm(nextState)
  }

  return (
    <>
      <Dialog
        open={openModal}
        onClose={handleClickCloseModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">추가</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {addForm.map((item, idx) => {
              return (
                <>
                  <Stack key={idx} sx={{ mb: 3 }}>
                    <div>
                      {item.type === 'text' ? (
                        <>
                          <TextField
                            id="outlined-basic"
                            label={item.label}
                            value={item.value}
                            onChange={(e) =>
                              handleChangeForm(item.key, e.target.value)
                            }
                          />
                        </>
                      ) : (
                        <></>
                      )}
                      {item.type === 'password' ? (
                        <>
                          <TextField
                            id="outlined-basic"
                            type="password"
                            label={item.label}
                            value={item.value}
                            onChange={(e) =>
                              handleChangeForm(item.key, e.target.value)
                            }
                          />
                        </>
                      ) : (
                        <></>
                      )}
                      {item.type === 'select' ? (
                        <>
                          <FormControl style={{ width: '100%' }}>
                            <InputLabel id={item.label}>
                              {item.label}
                            </InputLabel>
                            <Select
                              label={item.label}
                              defaultValue=""
                              id={item.label}
                              labelId={item.label}
                              style={{ width: '100%' }}
                              onChange={(e) =>
                                handleChangeForm(item.key, e.target.value)
                              }
                            >
                              {item.list.map((item, idx) => {
                                return (
                                  <MenuItem key={idx} value={item.value}>
                                    {item.label}
                                  </MenuItem>
                                )
                              })}
                            </Select>
                          </FormControl>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </Stack>
                </>
              )
            })}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleClickCloseModal}
          >
            취소
          </Button>
          <Button variant="contained" onClick={handleClickOpenConfirmModal}>
            추가
          </Button>
        </DialogActions>
      </Dialog>

      <AddConfirmModal
        openConfirmModal={openConfirmModal}
        handleClickCloseConfirmModal={handleClickCloseConfirmModal}
      />
    </>
  )
}

export default AddModal
