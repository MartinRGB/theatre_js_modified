import {editable as e, RefreshSnapshot, SheetProvider} from '@theatre/r3f'
import {Box, OrbitControls, Stars, TorusKnot} from '@react-three/drei'
import {getProject, types} from '@theatre/core'
import React, {Suspense, useEffect, useState} from 'react'
import {Canvas, invalidate} from '@react-three/fiber'
import {useGLTF, PerspectiveCamera} from '@react-three/drei'
import sceneGLB from './scene.glb'
import THREE, { DoubleSide, sRGBEncoding, TextureLoader } from 'three'
import type { Texture } from 'three'
document.body.style.backgroundColor = '#171717'

const EditableCamera = e(PerspectiveCamera, 'perspectiveCamera')


function Model({url}: {url: string}) {
  const {nodes} = useGLTF(url) as any


  const [currTex,setCurrTex] = useState<Texture | null>(null);

  useEffect(()=>{
    new TextureLoader().load(`https://172.22.0.20:8222/external/assets/02.png`, (tex) => {
      tex.encoding = sRGBEncoding;
      tex.needsUpdate = true;
      setCurrTex(tex)
      invalidate();
    });
  },[])

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -7, 0]} scale={7}>
      <group rotation={[Math.PI / 13.5, -Math.PI / 5.8, Math.PI / 5.6]}>
        <e.mesh
          theatreKey="Example Namespace / Thingy"
          receiveShadow
          castShadow
          geometry={nodes.planet001.geometry}
          material={nodes.planet001.material}
        />
        <e.mesh
          theatreKey="Example Namespace / Debris 2"
          receiveShadow
          castShadow
          geometry={nodes.planet002.geometry}
          material={nodes.planet002.material}
        />
        <e.mesh
          theatreKey="Debris 1"
          geometry={nodes.planet003.geometry}
          material={nodes.planet003.material}
        />
      <e.group theatreKey="trefoil7 / geometry" scale={[0.5, 0.5, 0.5]} position={[1,0,1]}>
        <Box scale={[4, 4, 4]} args={[1, 1, 1]}>
          <e.meshStandardMaterial 
            theatreKey="trefoil7 / material"
            mapSrc={{src:`https://172.22.0.20:8222/external/assets/test_222.png`,fileName:'222.png'}}
          />
        </Box>
      </e.group>

      <e.group theatreKey="trefoil5 / geometry" scale={[0.5, 0.5, 0.5]} position={[4,0,1]}>
        <Box scale={[4, 4, 4]} args={[1, 1, 1]}>
          <e.meshStandardMaterial 
            theatreKey="trefoil5 / material"
            mapSrc={{src:`https://172.22.0.20:8222/external/assets/02.png`,fileName:'123.png'}}
          />
        </Box>
      </e.group>

      </group>
    </group>
  )
}

function App() {
  const bgs = ['#272730', '#b7c5d1']
  const [bgIndex, setBgIndex] = useState(0)
  const bg = bgs[bgIndex]
  return (
    <div
      onClick={() => {
        // return setBgIndex((bgIndex) => (bgIndex + 1) % bgs.length)
      }}
      style={{
        height: '100vh',
      }}
    >
      <Canvas
        dpr={[1.5, 2]}
        linear
        shadows
        gl={{preserveDrawingBuffer: true}}
        frameloop="demand"
      >
        <SheetProvider sheet={getProject('Space').sheet('Scene')}>
          <fog attach="fog" args={[bg, 16, 30]} />
          <color attach="background" args={[bg]} />
          <ambientLight intensity={0.75} />
          <EditableCamera
            theatreKey="Camera"
            makeDefault
            position={[0, 0, 16]}
            fov={75}
          >
            <e.pointLight
              theatreKey="Light 1"
              intensity={1}
              position={[-10, -25, -10]}
            />
            <e.spotLight
              theatreKey="Light 2"
              castShadow
              intensity={2.25}
              angle={0.2}
              penumbra={1}
              position={[-25, 20, -15]}
              shadow-mapSize={[1024, 1024]}
              shadow-bias={-0.0001}
            />
            <e.directionalLight theatreKey="Light 3" />
          </EditableCamera>
          <Suspense fallback={null}>
            <RefreshSnapshot />
            <Model url={sceneGLB} />
          </Suspense>
          <Stars radius={500} depth={50} count={1000} factor={10} />
        </SheetProvider>
        <OrbitControls></OrbitControls>
      </Canvas>
    </div>
  )
}

export default App
