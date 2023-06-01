import React, {useEffect, useLayoutEffect} from 'react'
import styled from 'styled-components'
import {panelZIndexes} from '@theatre/studio/panels/BasePanel/common'
import ProjectsList from './ProjectsList/ProjectsList'
import {useVal} from '@theatre/react'
import getStudio from '@theatre/studio/getStudio'
import useHotspot from '@theatre/studio/uiComponents/useHotspot'
import {Box, prism, val} from '@theatre/dataverse'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'

const headerHeight = `44px`

const Container = styled.div<{pin: boolean}>`
  ${pointerEventsAutoInNormalMode};
  //background-color: white;
  position: absolute;
  // left: 8px;
  // z-index: ${panelZIndexes.outlinePanel};
  // top: calc(${headerHeight} + 8px);
  // height: fit-content;
  // max-height: calc(100% - ${headerHeight});
  // left:0px;
  // top:0px;
  // height:100vh;

  left: 8px;
  top: 8px;
  height:calc(100% - 17px);
  border-radius:12px;
  overflow-y: hidden;
  overflow-x: hidden;
  padding: 0;
  // padding-top: 40px;
  min-width:200px;
  user-select: none;
  z-index:-1;

  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  display: ${({pin}) => (pin ? 'block' : 'none')};

  &:hover {
    display: block;
  }

  // Create a small buffer on the bottom to aid selecting the bottom item in a long, scrolling list
  &::after {
    content: '';
    display: block;
    height: 20px;
  }
`

const BeforePadding = styled.div`
  height: 40px;
  background: black;
  border-radius: 12px 12px 0 0;
  border-top: 1px solid #4b4b4b;
  border-left: 1px solid #4b4b4b;
  border-right: 1px solid #4b4b4b;

`

const OutlinePanel: React.FC<{}> = () => {
  const pin = useVal(getStudio().atomP.ahistoric.pinOutline) ?? true
  const show = useVal(shouldShowOutlineD)
  const active = useHotspot('left')

  useLayoutEffect(() => {
    isOutlinePanelHotspotActiveB.set(active)
  }, [active])

  // cleanup
  useEffect(() => {
    return () => {
      isOutlinePanelHoveredB.set(false)
      isOutlinePanelHotspotActiveB.set(false)
    }
  }, [])

  return (
    <Container
      pin={pin}
      // pin={pin || show}
      onMouseEnter={() => {
        isOutlinePanelHoveredB.set(true)
      }}
      onMouseLeave={() => {
        isOutlinePanelHoveredB.set(false)
      }}
    >
      <BeforePadding/>
      <ProjectsList />
    </Container>
  )
}

export default OutlinePanel

const isOutlinePanelHotspotActiveB = new Box<boolean>(false)
const isOutlinePanelHoveredB = new Box<boolean>(false)

export const shouldShowOutlineD = prism<boolean>(() => {
  const isHovered = val(isOutlinePanelHoveredB.derivation)
  const isHotspotActive = val(isOutlinePanelHotspotActiveB.derivation)

  return isHovered || isHotspotActive
})
