import styled from 'styled-components'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import React from 'react'
import type {$FixMe, $IntentionalAny} from '@theatre/shared/utils/types'
import useTooltip from '@theatre/studio/uiComponents/Popover/useTooltip'
import mergeRefs from 'react-merge-refs'
import MinimalTooltip from '@theatre/studio/uiComponents/Popover/MinimalTooltip'
import ToolbarSwitchSelectContainer from './ToolbarSwitchSelectContainer'

export const Container = styled.button`
  ${pointerEventsAutoInNormalMode};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  border-radius:12px;
  width: 32px;
  height: 32px;
  outline: none;
  cursor:pointer;
  color:rgba(255, 255, 255, 0.5);
  background:black;
  border: none;

  svg {
    display: block;
  }

  &:hover {
    color: rgba(255, 255, 255, 0.9);
    background:#40aeff;
  }

  &:active {
    color: rgba(255, 255, 255, 0.9);
    background:#40aeff;
  }

  &.selected {
    color: rgba(255, 255, 255, 0.9);
    background:#40aeff;
  }

  // Don't blur if in a button group, because it already blurs. We need to blur
  // on the group-level, otherwise we get seams.
  ${ToolbarSwitchSelectContainer} > & {
    backdrop-filter: none;
    filter: none;
    border-radius: 0;

    &:first-child {
      border-top-left-radius: 2px;
      border-bottom-left-radius: 2px;
    }

    &:last-child {
      border-bottom-right-radius: 2px;
      border-top-right-radius: 2px;
    }
  }

  @supports not (backdrop-filter: blur()) {
    background: rgba(40, 43, 47, 0.95);
  }
`

const ToolbarIconButton: typeof Container = React.forwardRef(
  ({title, ...props}: $FixMe, ref: $FixMe) => {
    const [tooltip, localRef] = useTooltip(
      {enabled: typeof title === 'string'},
      () => <MinimalTooltip>{title}</MinimalTooltip>,
    )

    return (
      <>
        {tooltip}
        <Container ref={mergeRefs([localRef, ref])} {...props} />{' '}
      </>
    )
  },
) as $IntentionalAny

export default ToolbarIconButton
