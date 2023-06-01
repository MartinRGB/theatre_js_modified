import type {VoidFn} from '@theatre/shared/utils/types'
import React from 'react'
import styled, {css} from 'styled-components'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import {ChevronDown, Package} from '@theatre/studio/uiComponents/icons'

export const Container = styled.li`
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  align-items: flex-start;
`

export const BaseHeader = styled.div``

const Header = styled(BaseHeader)`
  position: relative;
  padding-left: calc(8px + var(--depth) * 16px);
  padding-right: 24px;
  width: 100%;
  gap: 4px;
  height: 32px;
  line-height: 0;
  box-sizing: border-box;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  pointer-events: none;
  white-space: nowrap;
  color: white;
  border: 1px solid transparent;

  &.descendant-is-selected {
    background: transparent;
  }

  ${pointerEventsAutoInNormalMode};
  &:not(.not-selectable):not(.selected):hover {
    border: 1px solid #40aeff;
  }

  &:not(.not-selectable):not(.selected):active {
    background: #40aeff;
  }

  &.selected {
    background: #40aeff;
  }

  // Hit zone
  &:before {
    position: absolute;
    inset: -1px 0;
    display: block;
    content: ' ';
    z-index: 5;
  }

  @supports not (backdrop-filter: blur()) {
    background: rgba(40, 43, 47, 0.95);
  }
`

export const outlineItemFont = css`
  font-family: 'Inter', 'Helvetica', sans-serif;
  font-size: 12px;
  font-weight:400;
  & {
  }
`

const Head_Label = styled.span`
  ${outlineItemFont};

  ${pointerEventsAutoInNormalMode};
  position: relative;
  // Compensate for border bottom
  top: 0.5px;
  display: flex;
  height: 20px;
  align-items: center;
  box-sizing: border-box;
`

const Head_IconContainer = styled.div`
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  opacity: 0.99;
`

const Head_Icon_WithDescendants = styled.span<{isOpen: boolean}>`
  font-size: 9px;
  position: relative;
  display: block;
`

const ChildrenContainer = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
`

type SelectionStatus =
  | 'not-selectable'
  | 'not-selected'
  | 'selected'
  | 'descendant-is-selected'

const BaseItem: React.FC<{
  label: React.ReactNode
  select?: VoidFn
  depth: number
  selectionStatus: SelectionStatus
  labelDecoration?: React.ReactNode
}> = ({label, children, depth, select, selectionStatus, labelDecoration}) => {
  const canContainChildren = children !== undefined

  return (
    <Container
      style={
        /* @ts-ignore */
        {'--depth': depth}
      }
    >
      <Header className={selectionStatus} onClick={select}>
        <Head_IconContainer>
          {canContainChildren ? (
            <Head_Icon_WithDescendants isOpen={true}>
              <ChevronDown />
            </Head_Icon_WithDescendants>
          ) : (
            <Package />
          )}
        </Head_IconContainer>

        <Head_Label>
          <span>{label}</span>
        </Head_Label>
        {labelDecoration}
      </Header>
      {canContainChildren && <ChildrenContainer>{children}</ChildrenContainer>}
    </Container>
  )
}

export default BaseItem
