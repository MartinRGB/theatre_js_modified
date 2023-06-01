import type * as propTypes from '@theatre/core/propTypes'
import {getPointerParts} from '@theatre/dataverse'
import type {Pointer, IDerivation} from '@theatre/dataverse'
import useContextMenu from '@theatre/studio/uiComponents/simpleContextMenu/useContextMenu'
import useRefAndState from '@theatre/studio/utils/useRefAndState'
import {last} from 'lodash-es'
import React from 'react'
import type {useEditingToolsForSimplePropInDetailsPanel} from '@theatre/studio/propEditors/useEditingToolsForSimpleProp'
import styled from 'styled-components'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import {propNameTextCSS} from '@theatre/studio/propEditors/utils/propNameTextCSS'
import type {PropHighlighted} from '@theatre/studio/panels/SequenceEditorPanel/whatPropIsHighlighted'
import {deriver} from '@theatre/studio/utils/derive-utils'
import {rowIndentationFormulaCSS} from './rowIndentationFormulaCSS'
import {getDetailRowHighlightBackground} from './getDetailRowHighlightBackground'

const Container = deriver(styled.div<{
  isHighlighted: PropHighlighted
}>`
  display: flex;
  // height: 30px;
  min-height: 30px;
  justify-content: flex-start;
  align-items: stretch;
  // We cannot calculate both the container (details panel) width and the descendant
  // (this) width dynamically. This leads to the container width being calculated
  // without this percentage being taken into consideration leads to horizontal
  // clipping/scrolling--the same way as if we explicitly fixed either the container
  // width, or the descendant width.
  // The correct solution for tabulated UIs with dynamic container widths is to use
  // CSS grid. For now I fixed this issue by just giving a great enough width
  // to the details panel so most things don't break.
  // --right-width: 60%;
  --right-width: 50%;
  position: relative;
  ${pointerEventsAutoInNormalMode};

  /* background-color: ${getDetailRowHighlightBackground}; */
`)

const Left = styled.div`
  box-sizing: border-box;
  // padding-left: ${rowIndentationFormulaCSS};
  padding-right: 4px;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  // align-items: stretch;
  align-items: baseline;
  line-height: 30px;
  gap: 4px;
  flex-grow: 0;
  flex-shrink: 0;
  width: calc(100% - var(--right-width));
`

const PropNameContainer = deriver(styled.div<{
  isHighlighted: PropHighlighted
}>`
  text-align: left;
  flex: 1 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  user-select: none;
  // cursor: default;
  cursor: pointer;
  font-family: 'Inter','Helvetica',sans-serif;
  font-size: 12px;
  font-weight: 300;
  color: rgba(255,255,255,0.5);
  
  
  &:hover {
    opacity:0.6;
  }
  
  // &:hover {
  //   color: white;
  // }
`)

const PropsName = styled.div`
  position:relative;
`

// ${propNameTextCSS};

const ControlsContainer = styled.div`
  flex-basis: 8px;
  flex: 0 0;
  display: flex;
  align-items: center;
  margin-left: 12px;
`

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: stretch;
  padding: 0 8px 0 2px;
  box-sizing: border-box;
  //height: 100%;
  min-height:30px;
  position: relative;
  width: var(--right-width);
  flex-shrink: 0;
  flex-grow: 0;
`

type ISingleRowPropEditorProps<T> = {
  propConfig: propTypes.PropTypeConfig
  pointerToProp: Pointer<T>
  editingTools: ReturnType<typeof useEditingToolsForSimplePropInDetailsPanel>
  isPropHighlightedD: IDerivation<PropHighlighted>
}

export function SingleRowPropEditor<T>({
  propConfig,
  pointerToProp,
  editingTools,
  children,
  isPropHighlightedD,
}: React.PropsWithChildren<ISingleRowPropEditorProps<T>>): React.ReactElement<
  any,
  any
> | null {
  const label = propConfig.label ?? last(getPointerParts(pointerToProp).path)

  const [propNameContainerRef, propNameContainer] =
    useRefAndState<HTMLDivElement | null>(null)

  const [contextMenu] = useContextMenu(propNameContainer, {
    menuItems: editingTools.contextMenuItems,
  })

  return (
    <Container isHighlighted={isPropHighlightedD}>
      {contextMenu}
      <Left>
        <ControlsContainer>{editingTools.controlIndicators}</ControlsContainer>
        <PropNameContainer
          isHighlighted={isPropHighlightedD}
          ref={propNameContainerRef}
          title={['obj', 'props', ...getPointerParts(pointerToProp).path].join(
            '.',
          )}
        >
          <PropsName>{label}</PropsName>
        </PropNameContainer>
      </Left>

      <InputContainer>{children}</InputContainer>
    </Container>
  )
}
