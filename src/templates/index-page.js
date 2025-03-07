import React from 'react'
import PropTypes from 'prop-types'
import FullScreenAnimation from '../components/FullScreenAnimation'
import Layout from '../components/Layout'
import CssBarcode from '../components/CssBarcode/CssBarcode'
import { useTransitionStore } from '../stores/TransitionStore'
import {
  animated,
  useTransition,
  config,
  useSpring,
  useSpringRef,
  useChain,
} from 'react-spring'
import '../components/all.sass'
import Seo from '../components/Seo'

// eslint-disable-next-line
export const IndexPageTemplate = ({}) => {
  const { introAnimationDone } = useTransitionStore()

  const transitionRef = useSpringRef()
  const transitions = useTransition(introAnimationDone, {
    from: { opacity: 1 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 1200,
    config: config.gentle,
    ref: transitionRef,
  })

  const springRef = useSpringRef()
  const springProps = useSpring({
    from: { opacity: !introAnimationDone ? 0 : 1 },
    to: { opacity: 1 },
    delay: 1000,
    ref: springRef,
  })

  useChain([transitionRef, springRef])

  return (
    <div>
      <Seo
        title={"clack studio"}
        description={
          "clack studio is a berlin based creative agency founded by a female friends duo in 2021. sharing the same vision and being linked by the belief that anything is possible, the studio develops concepts that reflect the current zeitgeist, brings impactful stories to life and creates experiences that resonate and push boundaries."
        }
      ></Seo>
      {transitions(({ opacity }, item) =>
        item ? (
          <animated.div style={springProps}>
            <CssBarcode />
          </animated.div>
        ) : (
          <animated.div
            className="fullscreen-animation-wrapper"
            style={{ opacity: opacity }}
          >
            <FullScreenAnimation />
          </animated.div>
        )
      )}
    </div>
  );
}

IndexPageTemplate.propTypes = {
  image: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  title: PropTypes.string,
  heading: PropTypes.string,
  subheading: PropTypes.string,
  mainpitch: PropTypes.object,
  description: PropTypes.string,
  intro: PropTypes.shape({
    blurbs: PropTypes.array,
  }),
}

const IndexPage = ({ data, location }) => {
  // const { frontmatter } = data.markdownRemark;

  return (
    <Layout location={location}>
      <IndexPageTemplate />
    </Layout>
  )
}

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
}

export default IndexPage
