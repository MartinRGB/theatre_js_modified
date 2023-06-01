import React from 'react'
import type {FileSrcObject, PropTypeConfig_FileSrc} from '@theatre/core/propTypes'
import type {ISimplePropEditorReactProps} from './ISimplePropEditorReactProps'
import BasicFileSrcInput from '@theatre/studio/uiComponents/form/BasicFileSrcInput'

function FileSrcPropEditor({
  editingTools,
  value,
}: ISimplePropEditorReactProps<PropTypeConfig_FileSrc>) {
  return (
    <BasicFileSrcInput
      value={value as FileSrcObject}
      permanentlySetValue={editingTools.permanentlySetValue}
      temporarilySetValue={editingTools.temporarilySetValue}
      discardTemporaryValue={editingTools.discardTemporaryValue}
    />
  )
}

export default FileSrcPropEditor
