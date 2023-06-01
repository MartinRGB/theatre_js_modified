import type {$IntentionalAny} from '@theatre/shared/utils/types'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import {transparentize} from 'polished'
import React from 'react'
import styled from 'styled-components'
import PopoverArrow from './PopoverArrow'

export const popoverBackgroundColor = transparentize(0.05, `#2a2a31`)

const Container = styled.div`
  position: absolute;
  //--popover-bg: ${popoverBackgroundColor};
  // --popover-bg:rgba(255,255,255,0.95);
  // --popover-inner-stroke: #4b4b4b; //505159
  // --popover-outer-stroke: #111;

  background: rgba(0,0,0,0.99);

  color: white;
  padding: 0;
  margin: 0;
  cursor: default;
  ${pointerEventsAutoInNormalMode};
  border-radius: 3px;
  z-index: 10000;
  
  // border: 1px solid var(--popover-inner-stroke);
  border: 1px solid #4b4b4b;

  & a {
    color: inherit;
  }
`

const BasicPopover: React.FC<{
  className?: string
  showPopoverEdgeTriangle?: boolean
}> = React.forwardRef(
  (
    {
      children,
      className,
      showPopoverEdgeTriangle: showPopoverEdgeTriangle = true,
    },
    ref,
  ) => {
    return (
      <Container className={className} ref={ref as $IntentionalAny}>
        {showPopoverEdgeTriangle ? <PopoverArrow /> : undefined}
        {children}
      </Container>
    )
  },
)

export default BasicPopover
