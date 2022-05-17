/* eslint-disable */
import { extend, useLoader } from '@react-three/fiber'

import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'
import { GRAY } from '../../../helpers/Colors'

const GradientShader = shaderMaterial(
  {
    firstColor: new THREE.Color(GRAY),
    middleColor: new THREE.Color('red'),
    endColor: new THREE.Color(GRAY),
  },
  // vertex shader
  glsl`
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }
  `,
  // fragment shader
  glsl`

      uniform vec3 firstColor;
      uniform vec3 middleColor;
      uniform vec3 endColor;

      varying vec2 vUv;
      float h = 0.5; // adjust position of middleColor

      
      void main() {
        // gl_FragColor = vec4(mix(color1, color2, vUv.y), 1);
        gl_FragColor = vec4(mix(mix(firstColor, middleColor, vUv.y/h), mix(middleColor, endColor, (vUv.y - h)/(1.0 - h)), step(h, vUv.y)), 1);        
      }

  `
)

extend({ GradientShader })
