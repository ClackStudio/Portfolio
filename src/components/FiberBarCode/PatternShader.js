import React, {useState, useRef, Suspense, useEffect, useMemo} from 'react'
import { extend, useLoader } from '@react-three/fiber'

import './styles.sass'
import { shaderMaterial,} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'






const PatternShader = shaderMaterial(
  { time: 0, 
    number1: 1,
    number2: 0,
    number3: 1,
    number4: 0,
    number5: 1,
    number6: 1,
    number7: 0,
    number8: 1},
  // vertex shader
  glsl`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment shader
  glsl`
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    uniform vec2 u_resolution;
    uniform int number1;
    uniform int number2;
    uniform int number3;
    uniform int number4;
    uniform int number5;
    uniform int number6;
    uniform int number7;
    uniform int number8;


    void main() {
      float cb = floor((vUv.x + time) * 8.0);
      float cb2 = floor((vUv.x + time + 2.0) * 4.0);
      vec3 ugColor = vec3(0.0);

      // ugColor += vec3(0.0,0.0,0.0);

      ugColor += vec3(mod(cb, 2.0),1.0,1.0);
      ugColor += vec3(mod(cb2, 2.0),0.0,0.0);


      // gl_FragColor = vec4(vec3(0.0), ugColor );
      vec2 st = gl_FragCoord.xy/vUv.xy;
      mediump float bar = 1.0;
      
      if (vUv.x < 0.125) {
          bar = float(number1);
      } else if (vUv.x < 0.25) {
        bar = float(number2);
      } else if (vUv.x < 0.375) {
        bar = float(number3);
      } else if (vUv.x < 0.5) {
        bar = float(number4);
      } else if (vUv.x < 0.625) {
        bar = float(number5);
      } else if (vUv.x < 0.75) {
        bar = float(number6);
      } else if (vUv.x < 0.875) {
        bar = float(number7);
      } else {
        bar = float(number8);
      }
      gl_FragColor = vec4(vec3(0.0),bar);

    }
  `
);

extend({ PatternShader })

// export default PatternShader

