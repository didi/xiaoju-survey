interface IEvent {
  handleConfirm: () => void,
  handleCancel: () => void
}

const useEvent = ({ emit, ctx }: any): IEvent => {
  const handleConfirm = () => {
    const list = ctx.list.value
    const index = ctx.index.value
    emit('confirm', list[index])
    emit('update:modelValue', false)
  }

  const handleCancel = () => {
    emit('update:modelValue', false)
    emit('cancel', false)
  }

  return {
    handleConfirm,
    handleCancel
  }
}

export default useEvent
