import type { EditableFactoryConfig } from './editableFactoryConfigUtils'
// ######################## File Props ########################
import {
  createColorPropConfig,
  createNumberPropConfig,
  createVector,
  createVectorPropConfig,
  createBooleanPropConfig, createNumberLietralPropConfig,createNumberRangePropConfig,createFileSrcPropConfig,NumberLiteral,
  extendObjectProps,
} from './editableFactoryConfigUtils'
// ######################## File Props ########################
import type {
  DirectionalLight,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  SpotLight,
  MeshStandardMaterial,
} from 'three'
import {
  BoxHelper,
  CameraHelper,
  Color,
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper,
} from 'three'
import { types } from '@theatre/core'

const baseObjectConfig = {
  props: {
    position: createVectorPropConfig('position'),
    rotation: createVectorPropConfig('rotation'),
    scale: createVectorPropConfig('scale', createVector([1, 1, 1])),
  },
  useTransformControls: true,
  icon: 'cube' as const,
  createHelper: (object: Object3D) => new BoxHelper(object, selectionColor),
}

const baseLightConfig = {
  ...extendObjectProps(baseObjectConfig, {
    intensity: createNumberPropConfig('intensity', 1),
    distance: createNumberPropConfig('distance'),
    decay: createNumberPropConfig('decay'),
    color: createColorPropConfig('color', new Color('white')),
  }),
  dimensionless: true,
}

const baseCameraConfig = {
  ...extendObjectProps(baseObjectConfig, {
    near: createNumberPropConfig('near', 0.1, {nudgeMultiplier: 0.1}),
    far: createNumberPropConfig('far', 2000, {nudgeMultiplier: 0.1}),
  }),
  updateObject: (camera: PerspectiveCamera | OrthographicCamera) => {
    camera.updateProjectionMatrix()
  },
  icon: 'camera' as const,
  dimensionless: true,
  createHelper: (camera: PerspectiveCamera) => new CameraHelper(camera),
}

const selectionColor = '#40AAA4'

const defaultEditableFactoryConfig = {
  group: {
    ...baseObjectConfig,
    icon: 'collection' as const,
    createHelper: (object: Object3D) => new BoxHelper(object, selectionColor),
  },
  mesh: {
    ...baseObjectConfig,
    icon: 'cube' as const,
    createHelper: (object: Object3D) => new BoxHelper(object, selectionColor),
  },
  meshStandardMaterial: {
    props: {
      color: createColorPropConfig('color', new Color('white')),
      transparent:createBooleanPropConfig('transparent', true),
      opacity:createNumberRangePropConfig('opacity', 1, {nudgeMultiplier: 0.1},[0,1]),
      //@ts-ignore
      side:createNumberLietralPropConfig('side',new NumberLiteral("2",{"0": 'FrontSide', "1": 'BackSide',"2":'DoubleSide',"3":'TwoPassDoubleSide'})),
      wireframe:createBooleanPropConfig('wireframe', false),
      fog:createBooleanPropConfig('fog', false),
      flatShading:createBooleanPropConfig('flatShading', false),
      //map:createFilePropConfig('map'),
      // mapSrc:createFileSrcPropConfig('mapSrc'),

      mapSrc:createFileSrcPropConfig('mapSrc'),
      alphaMapSrc:createFileSrcPropConfig('alphaMapSrc'),
      
      aoMapSrc:createFileSrcPropConfig('aoMapSrc'),
      aoMapIntensity:createNumberRangePropConfig('aoMapIntensity', 1, {nudgeMultiplier: 0.1},[0,1]),

      bumpMapSrc:createFileSrcPropConfig('bumpMapSrc'),
      bumpScale:createNumberRangePropConfig('bumpScale', 1, {nudgeMultiplier: 0.1},[0,1]),

      displacementMapSrc:createFileSrcPropConfig('displacementMapSrc'),
      displacementScale:createNumberRangePropConfig('displacementScale', 1, {nudgeMultiplier: 0.1},[0,1]),
      displacementBias:createNumberRangePropConfig('displacementBias', 0, {nudgeMultiplier: 0.1},[0,1]),
      
      emissive : createColorPropConfig('emissive', new Color('black')),
      emissiveMapSrc:createFileSrcPropConfig('emissiveMapSrc'),
      emissiveIntensity:createNumberRangePropConfig('emissiveIntensity', 0, {nudgeMultiplier: 0.1},[0,1]),
      
      envMapSrc:createFileSrcPropConfig('envMapSrc'),
      envMapIntensity:createNumberRangePropConfig('envMapIntensity', 0, {nudgeMultiplier: 0.1},[0,1]),

      lightMapSrc:createFileSrcPropConfig('lightMapSrc'),
      lightMapIntensity:createNumberRangePropConfig('lightMapIntensity', 1, {nudgeMultiplier: 0.1},[0,1]),

      metalnessMapSrc:createFileSrcPropConfig('metalnessMapSrc'),
      metalness:createNumberRangePropConfig('metalness', 0, {nudgeMultiplier: 0.1},[0,1]),

      normalMapSrc:createFileSrcPropConfig('normalMapSrc'),

      roughnessMapSrc:createFileSrcPropConfig('roughnessMapSrc'),
      roughness:createNumberRangePropConfig('roughness', 1, {nudgeMultiplier: 0.1},[0,1]),

      
    },
    test:{
      roughness:createNumberRangePropConfig('roughness', 1, {nudgeMultiplier: 0.1},[0,1]),
    },
    icon: 'cube' as const,
    dimensionless:true,
    useTransformControls: false,
  },
  spotLight: {
    ...extendObjectProps(baseLightConfig, {
      angle: createNumberPropConfig('angle', 0, {nudgeMultiplier: 0.001}),
      penumbra: createNumberPropConfig('penumbra', 0, {nudgeMultiplier: 0.001}),
    }),
    icon: 'spotLight' as const,
    createHelper: (light: SpotLight) =>
      new SpotLightHelper(light, selectionColor),
  },
  directionalLight: {
    ...extendObjectProps(baseObjectConfig, {
      intensity: createNumberPropConfig('intensity', 1),
      color: createColorPropConfig('color', new Color('white')),
    }),
    icon: 'sun' as const,
    dimensionless: true,
    createHelper: (light: DirectionalLight) =>
      new DirectionalLightHelper(light, 1, selectionColor),
  },
  pointLight: {
    ...baseLightConfig,
    icon: 'lightBulb' as const,
    createHelper: (light: PointLight) =>
      new PointLightHelper(light, 1, selectionColor),
  },
  ambientLight: {
    props: {
      intensity: createNumberPropConfig('intensity', 1),
      color: createColorPropConfig('color', new Color('white')),
    },
    useTransformControls: false,
    icon: 'lightBulb' as const,
  },
  hemisphereLight: {
    props: {
      intensity: createNumberPropConfig('intensity', 1),
      color: createColorPropConfig('color', new Color('white')),
      groundColor: createColorPropConfig('groundColor', new Color('white')),
    },
    useTransformControls: false,
    icon: 'lightBulb' as const,
  },
  perspectiveCamera: extendObjectProps(baseCameraConfig, {
    fov: createNumberPropConfig('fov', 50, {nudgeMultiplier: 0.1}),
    zoom: createNumberPropConfig('zoom', 1),
  }),
  orthographicCamera: baseCameraConfig,
  points: baseObjectConfig,
  line: baseObjectConfig,
  lineLoop: baseObjectConfig,
  lineSegments: baseObjectConfig,
  fog: {
    props: {
      color: createColorPropConfig('color'),
      near: createNumberPropConfig('near', 1, {nudgeMultiplier: 0.1}),
      far: createNumberPropConfig('far', 1000, {nudgeMultiplier: 0.1}),
    },
    useTransformControls: false,
    icon: 'cloud' as const,
  },
}

// Assert that the config is indeed of EditableFactoryConfig without actually
// forcing it to that type so that we can pass the real type to the editable factory
// Assert that the config is indeed of EditableFactoryConfig without actually
// forcing it to that type so that we can pass the real type to the editable factory
defaultEditableFactoryConfig as unknown as EditableFactoryConfig

export default defaultEditableFactoryConfig
