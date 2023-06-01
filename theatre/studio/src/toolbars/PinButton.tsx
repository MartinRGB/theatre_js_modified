import styled from 'styled-components'
import type {ComponentPropsWithRef, ReactNode} from 'react'
import React, {forwardRef, useState} from 'react'
import ToolbarIconButton from '@theatre/studio/uiComponents/toolbar/ToolbarIconButton'

const Container = styled(ToolbarIconButton)<{pinned?: boolean}>`
  color: ${({pinned}) => (pinned ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.5)')};

`
// border-bottom: 2px solid
//     ${({pinned}) =>
//       pinned ? ' #40aeff' : 'rgba(255, 255, 255, 0.)'};

interface PinButtonProps extends ComponentPropsWithRef<'button'> {
  icon: ReactNode
  pinHintIcon: ReactNode
  unpinHintIcon: ReactNode
  hint?: boolean
  pinned?: boolean
}

const PinButton = forwardRef<HTMLButtonElement, PinButtonProps>(
  (
    {children, hint, pinned, icon, pinHintIcon, unpinHintIcon, ...props},
    ref,
  ) => {
    const [hovered, setHovered] = useState(false)

    const showHint = hovered || hint

    return (
      <Container
        {...props}
        pinned={pinned}
        ref={ref}
        onMouseOver={() => setHovered(true)}
        onMouseOut={() => setHovered(false)}
      >
        {/* Necessary for hover to work properly. */}
        <div
          style={{
            pointerEvents: 'none',
            width: 'fit-content',
            height: 'fit-content',
            inset: 0,
          }}
        >
          {showHint && !pinned
            ? pinHintIcon
            : showHint && pinned
            ? unpinHintIcon
            : icon}
        </div>
        {children}
      </Container>
    )
  },
)

export default PinButton
