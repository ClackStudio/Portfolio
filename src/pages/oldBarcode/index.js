import React from "react";
import PropTypes from "prop-types";
import FullScreenAnimation from "../../components/FullScreenAnimation";
import Layout from "../../components/Layout";
import ProjectBarCode from "../../components/ProjectBarCode/ProjectBarCode";
import { useTransitionStore } from '../../stores/TransitionStore'
import { Transition, animated, useTransition, config } from "react-spring";
import { intersection } from "lodash";
import '../../components/all.sass'



// eslint-disable-next-line
export const IndexPageTemplate = ({}) => {

  const { introAnimationDone } = useTransitionStore()
  const transitions = useTransition(introAnimationDone, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    delay: 200,
    config: config.gentle,
  })

  // const transition = useTransition(introAnimationDone, false, {
  //   from: { opacity: 1 },
  //   enter: { opacity: 1 },
  //   leave: { opacity: 0 },
  //   expires: true
  // })
  return (
    <div>
        { !introAnimationDone && (
          <animated.div className="fullscreen-animation-wrapper">
          <FullScreenAnimation />
        </animated.div>
        )}
    {transitions(
    (styles, item) => item && <animated.div className="section is-full-height is-flex">
                      <ProjectBarCode></ProjectBarCode>
    </animated.div>
    )}
    </div>
  );
};

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
};

const IndexPage = ({ data, location }) => {
  // const { frontmatter } = data.markdownRemark;

  return (
    <Layout location={location}>
      <IndexPageTemplate
      // image={frontmatter.image}
      // title={frontmatter.title}
      // heading={frontmatter.heading}
      // subheading={frontmatter.subheading}
      // mainpitch={frontmatter.mainpitch}
      // description={frontmatter.description}
      // intro={frontmatter.intro}
      />


    </Layout>
  );
};

IndexPage.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.shape({
      frontmatter: PropTypes.object,
    }),
  }),
};

export default IndexPage;

// export const pageQuery = graphql`
//   query IndexPageTemplate {
//     markdownRemark(frontmatter: { templateKey: { eq: "index-page" } }) {
//       frontmatter {
//         title
//         image {
//           childImageSharp {
//             gatsbyImageData(quality: 100, layout: FULL_WIDTH)
//           }
//         }
//         heading
//         subheading
//         mainpitch {
//           title
//           description
//         }
//         description
//         intro {
//           blurbs {
//             image {
//               childImageSharp {
//                 gatsbyImageData(width: 240, quality: 64, layout: CONSTRAINED)
//               }
//             }
//             text
//           }
//           heading
//           description
//         }
//       }
//     }
//   }
// `;