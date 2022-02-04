import React from 'react'
import PropTypes from 'prop-types'
import './styles.sass'
import { Link, graphql, StaticQuery } from 'gatsby'
import PreviewCompatibleImage from '../PreviewCompatibleImage'
import PixiImage from './PixiImage'
import testImage from '../../../static/img/clack-1.jpg'

const stripes = [1,1,1,1,2,1,2,1,1,2,3,1,1,1,1,1,2,1,2,3,1,2,2]

const actionStripe = (number, index) => {
  return <div className={`bar-code-stripe type-${number}`} key={`stripe-${index}`}>
    <img className="stripe-image" src={testImage}></img>
    <PixiImage></PixiImage>
  </div>
};

const createStripes = params => stripes.map((number, index) => {
  if (number === 1) return <div className={`bar-code-stripe type-${number}`} key={`stripe-${index}`}></div>
  else return actionStripe(number, index)
})

const BarCode = props => {
  return (
    <div  className='bar-code-wrapper'>
      {createStripes()}
    </div>
  )
}

BarCode.propTypes = {

}

export default BarCode

