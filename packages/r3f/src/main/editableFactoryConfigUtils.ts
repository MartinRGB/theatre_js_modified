import type {UnknownShorthandCompoundProps} from '@theatre/core'
import {notify} from '@theatre/core'
import {types} from '@theatre/core'
import {Object3D, sRGBEncoding, Texture, TextureLoader, VideoTexture} from 'three'
import type {IconID} from '../extension/icons'
import {Color} from 'three'
import { invalidate } from '@react-three/fiber'

export type Helper = Object3D & {
  update?: () => void
}
type PropConfig<T> = {
  parse: (props: Record<string, any>) => T
  apply: (value: T, object: any) => void
  type: UnknownShorthandCompoundProps
}
type Props = Record<string, PropConfig<any>>
type Meta<T> = {
  useTransformControls: boolean
  updateObject?: (object: T) => void
  icon: IconID
  dimensionless?: boolean
  createHelper?: (object: T) => Helper
}
export type ObjectConfig<T> = {props: Props} & Meta<T>
export type EditableFactoryConfig = Partial<
  Record<keyof JSX.IntrinsicElements, ObjectConfig<any>>
>

type Vector3 = {
  x: number
  y: number
  z: number
}

function isNumber(value: any) {
  return typeof value === 'number' && isFinite(value)
}

function isVectorObject(value: any) {
  return (['x', 'y', 'z'] as const).every((axis) => isNumber(value[axis]))
}

export const createVector = (components?: [number, number, number]) => {
  return components
    ? {x: components[0], y: components[1], z: components[2]}
    : {
        x: 0,
        y: 0,
        z: 0,
      }
}

export const createVectorPropConfig = (
  key: string,
  defaultValue = createVector(),
  {nudgeMultiplier = 0.01} = {},
): PropConfig<Vector3> => ({
  parse: (props) => {
    const propValue = props[key]
    // if prop exists
    const vector = !propValue
      ? defaultValue
      : // if prop is an array
      Array.isArray(propValue)
      ? createVector(propValue as any)
      : // if prop is a scalar
      isNumber(propValue)
      ? {
          x: propValue,
          y: propValue,
          z: propValue,
        }
      : // if prop is a threejs Vector3
      isVectorObject(propValue)
      ? {
          x: propValue.x,
          y: propValue.y,
          z: propValue.z,
        }
      : // show a warning and return defaultValue
        (notify.warning(
          `Invalid value for vector prop "${key}"`,
          `Couldn't make sense of \`${key}={${JSON.stringify(
            propValue,
          )}}\`, falling back to \`${key}={${JSON.stringify([
            defaultValue.x,
            defaultValue.y,
            defaultValue.z,
          ])}}\`.

To fix this, make sure the prop is set to either a number, an array of numbers, or a three.js Vector3 object.`,
        ),
        defaultValue)
    ;(['x', 'y', 'z'] as const).forEach((axis) => {
      // e.g. r3f also accepts prop keys like "scale-x"
      if (props[`${key}-${axis}` as any])
        vector[axis] = props[`${key}-${axis}` as any]
    })
    return vector
  },
  apply: (value, object) => {
    object[key].set(value.x, value.y, value.z)
  },
  type: {
    [key]: {
      x: types.number(defaultValue.x, {nudgeMultiplier}),
      y: types.number(defaultValue.y, {nudgeMultiplier}),
      z: types.number(defaultValue.z, {nudgeMultiplier}),
    },
  },
})

export const createNumberPropConfig = (
  key: string,
  defaultValue: number = 0,
  {nudgeMultiplier = 0.01,range=[0,1]} = {},
): PropConfig<number> => ({
  parse: (props) => {
    return props[key] ?? defaultValue
  },
  apply: (value, object) => {
    object[key] = value
  },
  type: {
    [key]: types.number(defaultValue, {nudgeMultiplier}),
  },
})

export type Rgba = {
  r: number
  g: number
  b: number
  a: number
}

export const createColorPropConfig = (
  key: string,
  defaultValue = new Color(0, 0, 0),
): PropConfig<Rgba> => ({
  parse: (props) => {
    return {...(props[key] ?? defaultValue), a: 1}
  },
  apply: (value, object) => {
    object[key].setRGB(value.r, value.g, value.b)
  },
  type: {
    [key]: types.rgba({...defaultValue, a: 1}),
  },
})

// ######################## File Props ########################


export const createNumberRangePropConfig = (
  key: string,
  defaultValue: number = 0,
  {nudgeMultiplier = 0.01} = {},
  range:[min: number, max: number] = [0,1],
): PropConfig<number> => ({
  parse: (props) => {
    return props[key] ?? defaultValue
  },
  apply: (value, object) => {
    object[key] = value
  },
  type: {
    [key]: types.number(defaultValue, {nudgeMultiplier,range}),
  },
})


export class StringLietral {
  key:string;
  object:{ [x: string]: string; }
  constructor(key: string, object: { [x: string]: string; }){
    this.key = key;
    this.object = object;
  };
}

export const createStringLietralPropConfig = (
  key: string,
  defaultValue = new StringLietral("option",{"option 1": "Red", "option 2": "Green", "option 3": "Blue"}),
): PropConfig<string> => ({
  parse: (props) => {
    return props[key] ?? defaultValue.key
  },
  apply: (value, object) => {
    object[key] = value;
  },
  type: {
    [key]: types.stringLiteral(defaultValue.key, defaultValue.object),
  },
})

export class NumberLiteral {
  key:number;
  object:{ [x: number]: string; }
  constructor(key: number, object: { [x: number]: string; }){
    this.key = key;
    this.object = object;
  };
}

export const createNumberLietralPropConfig = (
  key: string,
  defaultValue = new NumberLiteral(0,{0: "Red", 1: "Green", 3: "Blue"}),
): PropConfig<string> => ({
  parse: (props) => {
    return props[key] ?? defaultValue.key
  },
  apply: (value, object) => {
    object[key] = Number(value);
  },
  //@ts-ignore
  type: {
    //@ts-ignore
    [key]: types.numberLiteral(defaultValue.key, defaultValue.object),
  },
})

export const createBooleanPropConfig = (
  key: string,
  defaultValue = false,
): PropConfig<boolean> => ({
  parse: (props) => {
    return props[key] ?? defaultValue
  },
  apply: (value, object) => {
    object[key] = value;
  },
  type: {
    [key]: types.boolean(defaultValue),
  },
})


class FileSrcObject {
  src:string
  fileName:string
  constructor(src:string,fileName:string){
    this.src= src;
    this.fileName = fileName;
  }
}

export type fSrcObject = {
  src:string,
  fileName:string,
}

export const createFileSrcPropConfig = (
  key: string,
  defaultValue = new FileSrcObject('',''),
): PropConfig<fSrcObject> => ({
  parse: (props) => {
    return props[key]
  },
  apply: (value, object) => {
    const imgExt = ['jpg','png','jpeg']
    const videoExt = ['mp4','web']
    const gltfExt = ['gltf','glb']
    if(value.src && value.src != ''){
      if(value.fileName){
        const fileExt =  (value.fileName.split('.')[value.fileName.split('.').length - 1]);
        if(imgExt.includes(fileExt)){
          new TextureLoader().load(value.src, (tex) => {
            tex.encoding = sRGBEncoding;
            // object[key.split('Src')[0]] = tex;
            // object[key.split('Src')[0]].needsUpdate = true;
            object.needsUpdate = true;
            object[`${key.split('Src')[0]}`] = tex;
            tex.dispose()
            invalidate();
          });
        }
    
        if(videoExt.includes(fileExt)){
          const videoE = document.createElement('video');
          videoE.src = value.src;
          videoE.crossOrigin = 'Anonymous'
          videoE.loop = true
          videoE.muted = true
          videoE.load();
          videoE.play();     
          const vidTex = new VideoTexture( videoE );
          vidTex.encoding = sRGBEncoding;
          object.needsUpdate = true;
          object[key.split('Src')[0]] = vidTex;
          vidTex.dispose()
          invalidate();
        }
      }
    }
    else{
      object[key.split('Src')[0]] = null;
      invalidate();
    }

  },
  type: {
    [key]: types.filesrc(defaultValue)
    
  },
})

// ######################## File Props ########################

export const extendObjectProps = <T extends {props: {}}>(
  objectConfig: T,
  extension: Props,
) => ({
  ...objectConfig,
  props: {...objectConfig.props, ...extension},
})
