import React, {useRef, useReducer, useState} from 'react'
import { useBarCodeStore, useBackgroundStore } from "./../../stores/BarCodeStore";
import {projects} from '../../data.mock/projects.mock'

import './styles.sass'

const ProjectNumber = ({project, index}) => {
  const {currentHoveredBar} = useBackgroundStore()
  return (<div className="project-number"> {index} {(currentHoveredBar === index) && project.name }</div>)
}

const BarcodeNumbers = () => {
  return <div className='barcode-numbers-wrapper'>
    {projects.map((project, index) => (<ProjectNumber project={project} index={index} key={`P-N-${index}`}></ProjectNumber>))}
  </div>;
};

export default BarcodeNumbers;