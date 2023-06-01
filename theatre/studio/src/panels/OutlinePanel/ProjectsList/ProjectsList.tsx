import {val} from '@theatre/dataverse'
import {usePrism} from '@theatre/react'
import getStudio from '@theatre/studio/getStudio'
import React from 'react'
import styled from 'styled-components'
import ProjectListItem from './ProjectListItem'

const Container = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  border: 1px solid #4b4b4b;
  border-radius: 0px 0px 12px 12px;
  height: calc(100% - 43px);
  background: black;
  overflow-x: hidden;
  overflow-y: overlay;

  ::-webkit-scrollbar {
      width: 2px;
      background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
      //background-color: #40aeff;
      //background-color: rgb(0 0 0 / 80%);
      background-color: transparent;
      border-radius: 100px;
  }
  ::-webkit-scrollbar-track {
      //box-shadow: inset 0 0 2px rgb(255 255 255 / 30%);
      background-color: transparent;
      border-radius: 100px;
  }
`

const ProjectsList: React.FC<{}> = (props) => {
  return usePrism(() => {
    const projects = val(getStudio().projectsP)

    return (
      <Container>
        {Object.keys(projects).map((projectId) => {
          const project = projects[projectId]
          return (
            <ProjectListItem
              depth={0}
              project={project}
              key={`projectListItem-${projectId}`}
            />
          )
        })}
      </Container>
    )
  }, [])
}

export default ProjectsList
