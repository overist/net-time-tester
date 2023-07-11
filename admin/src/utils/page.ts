import produce from 'immer'
import { updateState } from 'src/store/apps/page'

// 갱신
const updateAddForm = (dispatch, value) => {
  dispatch(updateState({ key: 'addForm', value }))
}

const updateActionForm = (dispatch, value) => {
  dispatch(updateState({ key: 'actionForm', value }))
}

const updateDetailForm = (dispatch, value) => {
  dispatch(updateState({ key: 'detailForm', value }))
}

const updateSearchForm = (dispatch, value) => {
  dispatch(updateState({ key: 'searchForm', value }))
}

const updateTableSetting = (dispatch, value) => {
  dispatch(updateState({ key: 'tableSetting', value }))
}

// 추가
const pushAddForm = (dispatch, addForm, value) => {
  dispatch(updateState({ key: 'addForm', value: [...addForm, value] }))
}

const pushActionForm = (dispatch, actionForm, value) => {
  dispatch(updateState({ key: 'actionForm', value: [...actionForm, value] }))
}

const pushDetailForm = (dispatch, detailForm, value) => {
  dispatch(updateState({ key: 'detailForm', value: [...detailForm, value] }))
}

const pushSearchForm = (dispatch, searchForm, value) => {
  dispatch(updateState({ key: 'searchForm', value: [...searchForm, value] }))
}

const pushTableSetting = (dispatch, tableSetting, value) => {
  dispatch(
    updateState({ key: 'tableSetting', value: [...tableSetting, value] })
  )
}

// 요소 삭제 및 순서 재정렬
const deleteAndReorder = (form, order) => {
  const newState = form
    .filter((item) => {
      if (item.order === order) return false
      else return true
    })
    .map((item, idx) => {
      const copyItem = { ...item }
      copyItem.order = idx

      return copyItem
    })

  return newState
}

// ANCHOR 파츠 삭제
export const deletePart = (dispatch, page, order) => {
  // 구분
  const { partType } = page

  // 입력값
  const { addForm, detailForm, searchForm, actionForm, tableSetting } = page

  // 삭제 처리
  if (partType === 'add' || partType === 'action') {
    const form = partType === 'add' ? addForm : actionForm
    const pushForm = partType === 'add' ? updateAddForm : updateActionForm
    pushForm(dispatch, deleteAndReorder(form, order))
  } else if (partType === 'detail') {
    updateDetailForm(dispatch, deleteAndReorder(detailForm, order))
  } else if (partType === 'search') {
    updateSearchForm(dispatch, deleteAndReorder(searchForm, order))
  } else if (partType === 'table') {
    updateTableSetting(dispatch, deleteAndReorder(tableSetting, order))
  }
}

// ANCHOR 파츠 추가
export const addPart = (dispatch, page) => {
  // 구분
  const { partType, partSubType } = page

  // 입력값
  const {
    inputLabel,
    inputKey,
    inputUseChip,
    inputSx,
    inputRows,
    inputAllowFileExt,
    inputMaxFileCount,
    inputMaxFileSizeBytes,
    inputSelectList,
    inputHeader,
    inputWidth,
    inputHeight,
    inputChipList
  } = page

  // 입력값
  const { addForm, detailForm, searchForm, actionForm, tableSetting } = page

  const defaultCondition =
    partSubType === 'text' ||
    partSubType === 'number' ||
    partSubType === 'password' ||
    partSubType === 'editor' ||
    partSubType === 'text' ||
    partSubType === 'date'
  const lineCondition = partSubType === 'line'
  const selectCondition = partSubType === 'select'
  const uploadCondition = partSubType === 'upload'
  const textareaCondition = partSubType === 'textarea'

  if (partType === 'add' || partType === 'action') {
    const form = partType === 'add' ? addForm : actionForm
    const pushForm = partType === 'add' ? pushAddForm : pushActionForm

    if (defaultCondition) {
      pushForm(dispatch, form, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: ''
      })
    } else if (lineCondition) {
      pushForm(dispatch, form, {
        type: partSubType,
        label: inputLabel,
        chip: inputUseChip,
        sx: inputSx
      })
    } else if (selectCondition) {
      pushForm(dispatch, form, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: '',
        list: inputSelectList
      })
    } else if (uploadCondition) {
      pushForm(dispatch, form, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: '',
        allowFileExt: inputAllowFileExt,
        maxFileCount: inputMaxFileCount,
        maxFileSizeBytes: inputMaxFileSizeBytes
      })
    } else if (textareaCondition) {
      pushForm(dispatch, form, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: '',
        rows: inputRows
      })
    }
  } else if (partType === 'search') {
    if (defaultCondition) {
      pushSearchForm(dispatch, searchForm, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: ''
      })
    } else if (lineCondition) {
      // 미사용
    } else if (selectCondition) {
      pushSearchForm(dispatch, searchForm, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: '',
        list: inputSelectList
      })
    } else if (uploadCondition) {
      // 미사용
    } else if (textareaCondition) {
      // 미사용
    }
  } else if (partType === 'detail') {
    if (defaultCondition) {
      pushDetailForm(dispatch, detailForm, {
        type: partSubType,
        label: inputLabel,
        key: inputKey,
        value: ''
      })
    } else if (lineCondition) {
      // 미사용
    } else if (selectCondition) {
      // 미사용
    } else if (uploadCondition) {
      // 미사용
    } else if (textareaCondition) {
      // 미사용
    }
  } else if (partType === 'table') {
    const defaultCondition = partSubType === 'text' || partSubType === 'date'
    const imageCondition = partSubType === 'image'
    const chipCondition = partSubType === 'chip'
    const modalCondition = partSubType === 'modal'
    const snackbarCondition = partSubType === 'snackbar'
    const actionCondition = partSubType === 'action'

    if (defaultCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType,
        key: inputKey
      })
    } else if (imageCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType,
        key: inputKey,
        width: inputWidth,
        height: inputHeight
      })
    } else if (chipCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType,
        key: inputKey,
        condition: inputChipList
      })
      console.log('inputChipList', inputChipList)
    } else if (modalCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType,
        key: inputKey,
        label: inputLabel
      })
    } else if (snackbarCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType,
        key: inputKey,
        label: inputLabel
      })
    } else if (actionCondition) {
      pushTableSetting(dispatch, tableSetting, {
        header: inputHeader,
        type: partSubType
      })
    }
  }
}

// ANCHOR 파츠 수정
export const updatePart = (dispatch, page) => {
  // 구분
  const { partType, partSubType } = page

  // 입력값
  const {
    inputOrder,
    inputLabel,
    inputKey,
    inputUseChip,
    inputSx,
    inputRows,
    inputAllowFileExt,
    inputMaxFileCount,
    inputMaxFileSizeBytes,
    inputSelectList,
    inputHeader,
    inputWidth,
    inputHeight,
    inputChipList
  } = page

  // 입력값
  const { addForm, detailForm, searchForm, actionForm, tableSetting } = page

  const defaultCondition =
    partSubType === 'text' ||
    partSubType === 'number' ||
    partSubType === 'password' ||
    partSubType === 'editor' ||
    partSubType === 'text' ||
    partSubType === 'date'
  const lineCondition = partSubType === 'line'
  const selectCondition = partSubType === 'select'
  const uploadCondition = partSubType === 'upload'
  const textareaCondition = partSubType === 'textarea'

  if (partType === 'add' || partType === 'action') {
    const form = partType === 'add' ? addForm : actionForm
    const pushForm = partType === 'add' ? updateAddForm : updateActionForm

    if (defaultCondition) {
      const nextState = produce(form, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
          }
        })
      })
      pushForm(dispatch, nextState)
    } else if (lineCondition) {
      const nextState = produce(form, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
            item.chip = inputUseChip
            item.sx = inputSx
          }
        })
      })
      pushForm(dispatch, nextState)
    } else if (selectCondition) {
      const nextState = produce(form, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
            item.list = inputSelectList
          }
        })
      })
      pushForm(dispatch, nextState)
    } else if (uploadCondition) {
      const nextState = produce(form, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
            item.allowFileExt = inputAllowFileExt
            item.maxFileCount = inputMaxFileCount
            item.maxFileSizeBytes = inputMaxFileSizeBytes
          }
        })
      })
      pushForm(dispatch, nextState)
    } else if (textareaCondition) {
      const nextState = produce(form, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
            item.rows = inputRows
          }
        })
      })
      pushForm(dispatch, nextState)
    }
  } else if (partType === 'search') {
    if (defaultCondition) {
      const nextState = produce(searchForm, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
          }
        })
      })
      updateSearchForm(dispatch, nextState)
    } else if (lineCondition) {
      // 미사용
    } else if (selectCondition) {
      const nextState = produce(searchForm, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
            item.list = inputSelectList
          }
        })
      })
      updateSearchForm(dispatch, nextState)
    } else if (uploadCondition) {
      // 미사용
    } else if (textareaCondition) {
      // 미사용
    }
  } else if (partType === 'detail') {
    if (defaultCondition) {
      const nextState = produce(detailForm, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.label = inputLabel
            item.key = inputKey
          }
        })
      })
      updateDetailForm(dispatch, nextState)
    } else if (lineCondition) {
      // 미사용
    } else if (selectCondition) {
      // 미사용
    } else if (uploadCondition) {
      // 미사용
    } else if (textareaCondition) {
      // 미사용
    }
  } else if (partType === 'table') {
    const defaultCondition = partSubType === 'text' || partSubType === 'date'
    const imageCondition = partSubType === 'image'
    const chipCondition = partSubType === 'chip'
    const modalCondition = partSubType === 'modal'
    const snackbarCondition = partSubType === 'snackbar'
    const actionCondition = partSubType === 'action'

    if (defaultCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
            item.key = inputKey
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    } else if (imageCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
            item.key = inputKey
            item.width = inputWidth
            item.height = inputHeight
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    } else if (chipCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
            item.key = inputKey
            item.condition = inputChipList
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    } else if (modalCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
            item.key = inputKey
            item.label = inputLabel
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    } else if (snackbarCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
            item.key = inputKey
            item.label = inputLabel
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    } else if (actionCondition) {
      const nextState = produce(tableSetting, (draftState) => {
        draftState.map((item) => {
          if (item.order === inputOrder) {
            item.header = inputHeader
          }
        })
      })
      updateTableSetting(dispatch, nextState)
    }
  }
}