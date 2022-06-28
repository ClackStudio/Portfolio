import React from 'react'
import PropTypes from 'prop-types'
import { graphql } from 'gatsby'
import Layout from '../components/Layout'
import Content, { HTMLContent } from '../components/Content'
import { TableLayout } from '../components/TableComponent'
import SectionTemplate from '../components/SectionTemplate'
import Seo from '../components/Seo'

// eslint-disable-next-line
export const AboutPageTemplate = ({ title, content, contentComponent }) => {
  const PageContent = contentComponent || Content

  return (
    <SectionTemplate className="single-page-wrapper">
      <Seo></Seo>
      <div className="columns fill-container">
        <div className="column is-flex fill-container">
          <div className={`is-12 is-flex is-flex-direction-column is-justify-content-flex-end fill-container bigger-font extra-top-padding`}>
            {/* <HalfPageNavbar /> */}
            {/* date */}
            <TableLayout>
              <PageContent content={content} />
            </TableLayout>
          </div>
        </div>
        {/* <PostContent content={content} /> */}
      </div>
      <div className="column is-6 fill-container">
        {/* <BigImage counter={counter.current} img={sideImage} ></BigImage> */}
      </div>
    </SectionTemplate>
  )
}

AboutPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  contentComponent: PropTypes.func,
}

const AboutPage = ({ data, location }) => {
  const { markdownRemark: post } = data

  return (
    <Layout location={location}>
      <AboutPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
      />
    </Layout>
  )
}

AboutPage.propTypes = {
  data: PropTypes.object.isRequired,
}

export default AboutPage

export const aboutPageQuery = graphql`
  query AboutPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
      }
    }
  }
`
