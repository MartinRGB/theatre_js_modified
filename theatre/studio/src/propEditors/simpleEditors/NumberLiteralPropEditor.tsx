import type {PropTypeConfig_NumberLiteral, PropTypeConfig_StringLiteral} from '@theatre/core/propTypes'
import React, {useCallback} from 'react'
import type {ISimplePropEditorReactProps} from './ISimplePropEditorReactProps'
import BasicNumberSelect from '@theatre/studio/uiComponents/form/BasicNumberSelect'

function NumberLiteralPropEditor<TLiteralOptions extends number>({
  propConfig,
  editingTools,
  value,
  autoFocus,
}: ISimplePropEditorReactProps<PropTypeConfig_NumberLiteral<TLiteralOptions>>) {
  const onChange = useCallback(
    (val: TLiteralOptions) => {
      editingTools.permanentlySetValue(val)
    },
    [propConfig, editingTools],
  )

  return propConfig.as === 'menu' ? (
    <BasicNumberSelect
      value={value}
      onChange={onChange}
      options={propConfig.valuesAndLabels}
      autoFocus={autoFocus}
    />
  ) : (
    <BasicNumberSelect
      value={value}
      onChange={onChange}
      options={propConfig.valuesAndLabels}
      autoFocus={autoFocus}
    />
  )
}

export default NumberLiteralPropEditor
