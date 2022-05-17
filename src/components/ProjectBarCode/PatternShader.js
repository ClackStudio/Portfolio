/* eslint-disable */
import React, { useState, useRef, Suspense, useEffect, useMemo } from 'react'
import { extend, useLoader } from '@react-three/fiber'

import { shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import * as THREE from 'three'

const PatternShader = shaderMaterial(
  {
    time: 0,
    number1: 1,
    number2: 0,
    number3: 1,
    number4: 0,
    number5: 1,
    number6: 1,
    number7: 0,
    number8: 1,
    number9: 1,
    number10: 0,
    number11: 1,
    number12: 0,
    number13: 1,
    number14: 1,
    number15: 0,
    number16: 1,
    isMobile: false,
  },
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
    uniform int number9;
    uniform int number10;
    uniform int number11;
    uniform int number12;
    uniform int number13;
    uniform int number14;
    uniform int number15;
    uniform int number16;
    uniform bool isMobile;


    void main() {
      float numberOfBars = 16.0;
      float barWidth = 1.0 / numberOfBars;
      float cb = floor((vUv.y + time) * 8.0);
      float cb2 = floor((vUv.x + time + 2.0) * 4.0);
      vec3 ugColor = vec3(0.0);

      // ugColor += vec3(0.0,0.0,0.0);

      ugColor += vec3(mod(cb, 2.0),1.0,1.0);
      ugColor += vec3(mod(cb2, 2.0),0.0,0.0);


      // gl_FragColor = vec4(vec3(0.0), ugColor );
      vec2 st = gl_FragCoord.xy/vUv.xy;
      mediump float bar = 1.0;

      if (isMobile != true) {
        if (vUv.x < barWidth) {
          bar = float(number1);
        }
        else if (vUv.x < barWidth * 2.0) {
            bar = float(number2);
        } else if (vUv.x < barWidth * 3.0) {
          bar = float(number3);
        }else if (vUv.x < barWidth * 4.0) {
          bar = float(number4);
        } else if (vUv.x < barWidth * 5.0) {
          bar = float(number5);
        } else if (vUv.x < barWidth * 6.0) {
          bar = float(number6);
        } else if (vUv.x < barWidth * 7.0) {
          bar = float(number7);
        } else if (vUv.x < barWidth * 8.0) {
          bar = float(number8);
        } else if (vUv.x < barWidth * 9.0) {
          bar = float(number9);
        } else if (vUv.x < barWidth * 10.0) {
          bar = float(number10);
        } else if (vUv.x < barWidth * 11.0) {
          bar = float(number11);
        } else if (vUv.x < barWidth * 12.0) {
          bar = float(number12);
        } else if (vUv.x < barWidth * 13.0) {
          bar = float(number13);
        } else if (vUv.x < barWidth * 14.0) {
          bar = float(number14);
        } else if (vUv.x < barWidth * 15.0) {
          bar = float(number15);
        } else {
          bar = float(number16);
        }

      } else {
        if (vUv.y < barWidth) {
          bar = float(number1);
        }
        else if (vUv.y < barWidth * 2.0) {
            bar = float(number2);
        } else if (vUv.y < barWidth * 3.0) {
          bar = float(number3);
        }else if (vUv.y < barWidth * 4.0) {
          bar = float(number4);
        } else if (vUv.y < barWidth * 5.0) {
          bar = float(number5);
        } else if (vUv.y < barWidth * 6.0) {
          bar = float(number6);
        } else if (vUv.y < barWidth * 7.0) {
          bar = float(number7);
        } else if (vUv.y < barWidth * 8.0) {
          bar = float(number8);
        } else if (vUv.y < barWidth * 9.0) {
          bar = float(number9);
        } else if (vUv.y < barWidth * 10.0) {
          bar = float(number10);
        } else if (vUv.y < barWidth * 11.0) {
          bar = float(number11);
        } else if (vUv.y < barWidth * 12.0) {
          bar = float(number12);
        } else if (vUv.y < barWidth * 13.0) {
          bar = float(number13);
        } else if (vUv.y < barWidth * 14.0) {
          bar = float(number14);
        } else if (vUv.y < barWidth * 15.0) {
          bar = float(number15);
        } else {
          bar = float(number16);
        }
      }
      
      
      gl_FragColor = vec4(vec3(0.0),bar);

    }
  `
)

extend({ PatternShader })

// export default PatternShader
