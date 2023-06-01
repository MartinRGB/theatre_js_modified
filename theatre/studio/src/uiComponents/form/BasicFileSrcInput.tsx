import styled from 'styled-components'
import type {MutableRefObject} from 'react';
import React, {useMemo, useRef} from 'react'
import useRefAndState from '@theatre/studio/utils/useRefAndState'
import type { FileSrcObject } from '@theatre/core/propTypes';

const TextHolder = styled.div<{isSelect:boolean}>`
  line-height: 30px;
  padding-left: 6px;
  padding:right:6px;
  cursor:pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  border:1px solid transparent;
  color:white;
  opacity:${(props)=>(props.isSelect?'1':'0.5')};
  
  &:hover{
    border:1px solid #4b4b4b;
    opacity:0.8;
  }
  &:active{
    border:1px solid #40aeff;
    opacity:0.8;
  }

`

const Container = styled.div`
width: 100%;

`

const MediaContainer = styled.div`
  width: calc(100% - 2px);
  margin-top: 4px;
  margin-bottom: 4px;
  background-color: rgba(127,127,127,1.0);
  background-image: linear-gradient(45deg,#b0b0b0 25%,transparent 25%),linear-gradient(-45deg,#b0b0b0 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#b0b0b0 75%),linear-gradient(-45deg,transparent 75%,#b0b0b0 75%);
  background-size: 20px 20px;
  background-position: 0 0,0 10px,10px -10px,-10px 0px;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 0 0 1px #4b4b4b;
  height: 80px;
  position:relative;
`

const Image = styled.img`
  // width: calc(100% - 20px);
  // max-height: 60px;
  // margin: 10px;
  // object-fit: contain;
  height: 100%;
  width: 100%;
  object-fit: scale-down;
`

const Video = styled.video`
  width: 100%;
  // height: 80px;
  height: 100%;
  cursor: pointer;
  object-fit: contain;
`

const RemoveBtn = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  cursor: pointer;
  background: #4b4b4b;
  padding: 4px;
  line-height: 15px;
  border-radius: 4px;
  z-index:1;
`

const imgExt = ['jpg','png']
const videoExt = ['mp4','web']
const gltfExt = ['gltf','glb']

type IState_Init = {
  mode: 'init'
}

type IState_Empty = {
  mode: 'empty'
}

type IState_Selected_File = {
  mode: 'selected_file'
  currentFileObject: FileSrcObject
}

type IState = IState_Init | IState_Selected_File | IState_Empty


// const alwaysValid = (v: string) => true

const BasicFileSrcInput: React.FC<{
  value: FileSrcObject
  permanentlySetValue: (v: FileSrcObject) => void
  temporarilySetValue: (v: FileSrcObject) => void
  discardTemporaryValue: () => void
  inputRef?: MutableRefObject<HTMLInputElement | null>
}> = (props) => {
  const [stateRef] = useRefAndState<IState>({mode: 'init'})

  const propsRef = useRef(props)
  propsRef.current = props
  //propsRef.current.discardTemporaryValue()
  // const inputRef = useRef<HTMLInputElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  
  const callbacks = useMemo(() => {
    const fileChange = (e: React.ChangeEvent) => {
      const target = e.target as HTMLInputElement
      if(target.files && target.files.length === 1) {
        const file = target.files[0];
        const fileBlobUrl = URL.createObjectURL(file);
        const fileExt =  (file.name.split('.')[file.name.split('.').length - 1]);
        if(imgExt.includes(fileExt)){
          const finalResult = {
            src:fileBlobUrl,
            fileName:file.name,
          }
          stateRef.current = {
            mode: 'selected_file', 
            currentFileObject: finalResult
          }
          
          propsRef.current.temporarilySetValue(finalResult)

        }


        if(videoExt.includes(fileExt)){
          const finalResult = {
            src:fileBlobUrl,
            fileName:file.name,
          }
          stateRef.current = {
            mode: 'selected_file', 
            currentFileObject: finalResult
          }
          propsRef.current.temporarilySetValue(finalResult)
        }
        
      
      }
    }

    const textOnClick = (e: React.MouseEvent) => {
      if(fileInputRef.current) fileInputRef.current.click()
    }

    const removeOnClick = (e: React.MouseEvent) => {
      const finalResult = {
        src:'',
        fileName: ''
      }
      stateRef.current = {
        mode: 'empty'
      }
      if(fileInputRef.current) fileInputRef.current.value = '';
      propsRef.current.temporarilySetValue(finalResult)
    }

    return {
      fileChange,
      textOnClick,
      removeOnClick
    }
  }, [])
  return (
    <>
    <Container>
      <TextHolder 
        isSelect={props.value.fileName != null && props.value.fileName != ''} 
        onClick={callbacks.textOnClick}>
        {props.value.fileName?props.value.fileName:'select file'}
      </TextHolder>
      
      {props.value.fileName?
        <MediaContainer>
        {stateRef.current.mode === 'empty'?<></>:<RemoveBtn onClick={callbacks.removeOnClick}>remove</RemoveBtn>}
        {
          (imgExt.includes(props.value.fileName.split('.')[props.value.fileName.split('.').length-1]))?
            <Image src={props.value.src}></Image>
            :
            (videoExt.includes(props.value.fileName.split('.')[props.value.fileName.split('.').length-1]))?
              <>
                <Video src={props.value.src} onClick={(e)=>{
                    if((e.target as HTMLVideoElement).paused){
                      (e.target as HTMLVideoElement).play()
                    }
                    else{
                      (e.target as HTMLVideoElement).pause()
                    }
                  }
                } muted loop autoPlay={false}></Video>
              </>
              :
              (gltfExt.includes(props.value.fileName.split('.')[props.value.fileName.split('.').length-1]))?
              <></>
              :
              <></>
        }
        </MediaContainer>
        :
        <></>
      }
      <input
        key="file_input"
        type="file"
        style={{display:'none'}}
        ref={fileInputRef}
        onChange={callbacks.fileChange}
        multiple = {false} 
        accept= {"image/png, image/gif, image/jpeg, video/mp4, video/webm"}
      />
    </Container>
    </>
  )
}

function format(v: string): string {
  return v
}

export default BasicFileSrcInput

