import { Modal, message } from 'antd'

const _deleteOptions = {
  title: '警告',
  content: '确定要删除这条数据？',
  okText: '确认',
  cancelText: '取消'
}

/**
 * 删除提示框
 */
const deleteConfirm = () => weConfirm('delete')

const successToast = msg => weToast(msg, 'success')
const warnToast = msg => weToast(msg, 'warn')
const errorToast = msg => weToast(msg, 'error')

const weToast = (msg, type) => {
  if (type === 'success') {
    message.success(msg || '操作成功')
  } else if (type === 'error') {
    message.error(msg || '操作失败')
  } else if (type === 'warn') {
    message.warning(msg || '操作不当')
  }
}

const weConfirm = type =>
  new Promise((resolve, reject) => {
    let options = getOptions(type)
    Modal.confirm({
      ...options,
      onOk() {
        resolve()
      },
      onCancel() {
        reject()
      }
    })
  })

const getOptions = type => {
  if (type == 'delete') {
    return _deleteOptions
  }
}

const mergeColumns = columns =>
  columns.map(col => ({ align: 'center', ...col }))

export default {
  deleteConfirm,
  successToast,
  errorToast,
  warnToast,
  mergeColumns
}
