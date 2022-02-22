import React, {Suspense, useEffect, useRef, useCallback} from 'react'
import './styles.sass'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { Stats, AdaptiveEvents } from '@react-three/drei'
import BarCodeBackground from './BarCodeBackground'
import FlexLayout from './FlexLayout'
import BarcodeNumbers from '../BarcodeNumbers/BarcodeNumbers'
import {GRAY} from '../../helpers/Colors'
import { Link, graphql, StaticQuery } from 'gatsby'
// import PreviewCompatibleImage from './PreviewCompatibleImage'

const ProjectBarCodeTemplate = ({data}) => {
  const { edges: projects } = data.allMarkdownRemark


    return (
      <>
      <div className='container' style={{display: 'block'}}>
<div className="canvas-wrapper">
            <Canvas dpr={[1, 1.5]} resize={{ debounce: 0, scroll: false }}>
            {/* <color attach="background" args={['transparent']} /> */}

            {/* <Stats showPanel={0} className="stats"/> */}
              <Suspense fallback={null}>
                  {/* Main */}
                  {/* <directionalLight
                      position={[1, 10, -2]}
                      color={'0xff0000'}
                      intensity={1}
                  /> */}
                <FlexLayout projects={projects}></FlexLayout>

                  <AdaptiveEvents />

                <BarCodeBackground></BarCodeBackground>
              </Suspense>
            </Canvas>
        </div>

      </div>
      <BarcodeNumbers></BarcodeNumbers>

      </>
        )
}

const ProjectBarCode = () => {
  return (
    <StaticQuery
      query={graphql`
        query ProjectRollQuery {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            filter: { frontmatter: { templateKey: { eq: "project-post" } } }
          ) {
            edges {
              node {
                excerpt(pruneLength: 400)
                id
                fields {
                  slug
                }
                frontmatter {
                  title
                  templateKey
                  date(formatString: "YYYY")
                  featuredpost
                  featuredimage {
                    childImageSharp {
                      gatsbyImageData(
                        width: 1080
                        quality: 100
                        layout: CONSTRAINED
                      )

                    }
                  }
                }
              }
            }
          }
        }
      `}
      render={(data, count) => <ProjectBarCodeTemplate data={data} count={count} />}
    />
  );
}







ProjectBarCode.propTypes = {

}

export default ProjectBarCode
