import React, {Suspense, useEffect, useRef, useCallback} from 'react'
import PropTypes from 'prop-types'
import { Canvas } from '@react-three/fiber'
import { Stats, AdaptiveEvents } from '@react-three/drei'
import BarCodeBackground from './BarCodeBackground'
import FlexLayout from './FlexLayout'
import BarcodeNumbers from '../BarcodeNumbers/BarcodeNumbers'
import {GRAY} from '../../helpers/Colors'
import { Link, graphql, StaticQuery } from 'gatsby'
// import PreviewCompatibleImage from './PreviewCompatibleImage'

const ProjectBarCodeTemplate = ({data, projectsIndex}) => {
  const { edges: projects } = data.allMarkdownRemark
  console.log(projectsIndex)
  if (projectsIndex) {
    return (
    <>
            <Canvas dpr={[1, 2]} resize={{ debounce: 0, scroll: false }}>
              <Suspense fallback={null}>
                <FlexLayout projects={projects} projectsIndex></FlexLayout>

                  <AdaptiveEvents />

                <BarCodeBackground></BarCodeBackground>
              </Suspense>
            </Canvas>
      </>
    )
  } else {
    // home page
    return (
    <>
    <div className="canvas-wrapper">
            <Canvas dpr={[1, 2]} resize={{ debounce: 0, scroll: false }}>
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

      {/* </div> */}
      <BarcodeNumbers projects={projects}></BarcodeNumbers>
      </>
    )
  }
        
}

const ProjectBarCode = ({projectsIndex}) => {
  return (
    <StaticQuery
      query={graphql`
        query BarCodeQuery {
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
      render={(data, count) => <ProjectBarCodeTemplate projectsIndex={projectsIndex} data={data} count={count} />}
    />
  );
}


ProjectBarCode.propTypes = {

}

export default ProjectBarCode
