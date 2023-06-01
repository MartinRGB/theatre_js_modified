import {getOutlineSelection} from '@theatre/studio/selectors'
import {usePrism, useVal} from '@theatre/react'
import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react'
import styled from 'styled-components'
import {isProject, isSheetObject} from '@theatre/shared/instanceTypes'
import {
  panelZIndexes,
  TitleBar_Piece,
  TitleBar_Punctuation,
} from '@theatre/studio/panels/BasePanel/common'
import {pointerEventsAutoInNormalMode} from '@theatre/studio/css'
import ObjectDetails from './ObjectDetails'
import ProjectDetails from './ProjectDetails'
import getStudio from '@theatre/studio/getStudio'
import useHotspot from '@theatre/studio/uiComponents/useHotspot'
import {Box, prism, val} from '@theatre/dataverse'
import EmptyState from './EmptyState'
import useLockSet from '@theatre/studio/uiComponents/useLockSet'
import {usePresenceListenersOnRootElement} from '@theatre/studio/uiComponents/usePresence'

const headerHeight = `32px`

const Container = styled.div<{pin: boolean}>`
  ${pointerEventsAutoInNormalMode};
  // background-color: rgba(40, 43, 47, 0.8);
  //background-color: white;
  position: fixed;
  // right: 8px;
  // right:0px;
  // top: 50px;
  // top:0px;
  // Temporary, see comment about CSS grid in SingleRowPropEditor.
  width: 320px;
  //padding-top: 40px;
  right: 8px;
  top: 8px;
  border-radius: 12px;
  z-index:-1;

  height:calc(100% - 17px);
  overflow-y: hidden;
  overflow-x: hidden;

  // box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.15);
  // backdrop-filter: blur(14px);
  // border-radius: 2px;

  display: ${({pin}) => (pin ? 'block' : 'none')};

  &:hover {
    display: block;
  }

  // @supports not (backdrop-filter: blur()) {
  //   background: rgba(40, 43, 47, 0.95);
  // }
`
const BeforePadding = styled.div`
  height: 40px;
  background: black;
  border-radius: 12px 12px 0 0;
  border-top: 1px solid #4b4b4b;
  border-left: 1px solid #4b4b4b;
  border-right: 1px solid #4b4b4b;

`

const Title = styled.div`
  margin: 0 10px;
  color: #919191;
  font-weight: 500;
  font-size: 10px;
  user-select: none;
  ${pointerEventsAutoInNormalMode};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

const Header = styled.div`
  height: ${headerHeight};
  display: flex;
  align-items: center;
  border: 1px solid #4b4b4b;
  background: black;

`

const Body = styled.div`
  ${pointerEventsAutoInNormalMode};
  // max-height: calc(100vh - 100px);
  overflow-y: scroll;
  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
  padding: 0;
  user-select: none;

  /* Set the font-size for input values in the detail panel */
  font-size: 12px;

  border-bottom: 1px solid #4b4b4b;
  border-left: 1px solid #4b4b4b;
  border-right: 1px solid #4b4b4b;
  border-radius: 0px 0px 12px 12px;
  height: calc(100% - 76px);
  background: black;
  overflow-x: hidden;
  overflow-y: overlay;

  ::-webkit-scrollbar {
      width: 2px;
      background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
      //background-color: #40aeff;
      // background-color: rgb(0 0 0 / 80%);
      background-color: transparent;
      border-radius: 100px;
  }
  ::-webkit-scrollbar-track {
      //box-shadow: inset 0 0 2px rgb(255 255 255 / 30%);
      background-color: transparent;
      border-radius: 100px;
  }
`

export const contextMenuShownContext = createContext<
  ReturnType<typeof useLockSet>
>([false, () => () => {}])

const DetailPanel: React.FC<{}> = (props) => {
  const pin = useVal(getStudio().atomP.ahistoric.pinDetails) !== false

  const hotspotActive = useHotspot('right')

  useLayoutEffect(() => {
    isDetailPanelHotspotActiveB.set(hotspotActive)
  }, [hotspotActive])

  // cleanup
  useEffect(() => {
    return () => {
      isDetailPanelHoveredB.set(false)
      isDetailPanelHotspotActiveB.set(false)
    }
  }, [])

  const [isContextMenuShown] = useContext(contextMenuShownContext)

  // const showDetailsPanel = pin || hotspotActive || isContextMenuShown
  const showDetailsPanel = pin || isContextMenuShown

  const [containerElt, setContainerElt] = useState<null | HTMLDivElement>(null)
  usePresenceListenersOnRootElement(containerElt)

  return usePrism(() => {
    const selection = getOutlineSelection()

    const obj = selection.find(isSheetObject)
    if (obj) {
      return (
        <Container
          data-testid="DetailPanel-Object"
          pin={showDetailsPanel}
          ref={setContainerElt}
          onMouseEnter={() => {
            isDetailPanelHoveredB.set(true)
          }}
          onMouseLeave={() => {
            isDetailPanelHoveredB.set(false)
          }}
        >
          <BeforePadding/>
          <Header>
            <Title
              title={`${obj.sheet.address.sheetId}: ${obj.sheet.address.sheetInstanceId} > ${obj.address.objectKey}`}
            >
              <TitleBar_Piece>{obj.sheet.address.sheetId} </TitleBar_Piece>

              <TitleBar_Punctuation>{':'}&nbsp;</TitleBar_Punctuation>
              <TitleBar_Piece>
                {obj.sheet.address.sheetInstanceId}{' '}
              </TitleBar_Piece>

              <TitleBar_Punctuation>&nbsp;&rarr;&nbsp;</TitleBar_Punctuation>
              <TitleBar_Piece>{obj.address.objectKey}</TitleBar_Piece>
            </Title>
          </Header>
          <Body>
            <ObjectDetails objects={[obj]} />
          </Body>
        </Container>
      )
    }
    const project = selection.find(isProject)
    if (project) {
      return (
        <Container pin={showDetailsPanel}>
          <BeforePadding/>
          <Header>
            <Title title={`${project.address.projectId}`}>
              <TitleBar_Piece>{project.address.projectId} </TitleBar_Piece>
            </Title>
          </Header>
          <Body>
            <ProjectDetails projects={[project]} />
          </Body>
        </Container>
      )
    }

    return (
      <Container
        pin={showDetailsPanel}
        onMouseEnter={() => {
          isDetailPanelHoveredB.set(true)
        }}
        onMouseLeave={() => {
          isDetailPanelHoveredB.set(false)
        }}
      >
        <BeforePadding/>
        <div
          style={{
              border: '1px solid #4b4b4b',
              borderRadius: '0px 0px 12px 12px',
              height: 'calc(100% - 43px)',
              background: 'black'
          }}
        >
          <EmptyState/>
        </div>
        
      </Container>
    )
  }, [showDetailsPanel])
}

export default () => {
  const lockSet = useLockSet()

  return (
    <contextMenuShownContext.Provider value={lockSet}>
      <DetailPanel />
    </contextMenuShownContext.Provider>
  )
}

const isDetailPanelHotspotActiveB = new Box<boolean>(false)
const isDetailPanelHoveredB = new Box<boolean>(false)

export const shouldShowDetailD = prism<boolean>(() => {
  const isHovered = val(isDetailPanelHoveredB.derivation)
  const isHotspotActive = val(isDetailPanelHotspotActiveB.derivation)

  return isHovered || isHotspotActive
})
