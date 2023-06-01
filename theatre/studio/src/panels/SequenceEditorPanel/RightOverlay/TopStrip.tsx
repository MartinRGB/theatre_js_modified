import {useVal} from '@theatre/react'
import type {Pointer} from '@theatre/dataverse'
import React from 'react'
import styled from 'styled-components'
import type {SequenceEditorPanelLayout} from '@theatre/studio/panels/SequenceEditorPanel/layout/layout'
import StampsGrid from '@theatre/studio/panels/SequenceEditorPanel/FrameGrid/StampsGrid'
import {includeLockFrameStampAttrs} from '@theatre/studio/panels/SequenceEditorPanel/FrameStampPositionProvider'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import FocusRangeZone from './FocusRangeZone/FocusRangeZone'

export const topStripHeight = 18

export const topStripTheme = {
  // backgroundColor: `#1f2120eb`,
  // borderColor: `#1c1e21`,
  backgroundColor: `rgba(0,0,0,0.99)`,
  borderColor: `rgba(225, 225, 225, 0.1)`,
}

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: ${topStripHeight}px;
  box-sizing: border-box;
  background: ${topStripTheme.backgroundColor};
  border-bottom: 1px solid #4b4b4b;
  ${pointerEventsAutoInNormalMode};
`

const TopStrip: React.FC<{layoutP: Pointer<SequenceEditorPanelLayout>}> = ({
  layoutP,
}) => {
  const width = useVal(layoutP.rightDims.width)

  return (
    <>
      <Container {...includeLockFrameStampAttrs('hide')}>
        <StampsGrid layoutP={layoutP} width={width} height={topStripHeight} />
        <FocusRangeZone layoutP={layoutP} />
      </Container>
    </>
  )
}

export default TopStrip
