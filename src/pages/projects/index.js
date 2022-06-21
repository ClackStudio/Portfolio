import React from 'react'

import SectionTemplate from '../../components/SectionTemplate'
import { TableLayout, TableRowComponent } from '../../components/TableComponent'
import { helmet } from 'react-helmet'
import Navbar from '../../components/Navbar'
import { graphql, StaticQuery, navigate } from 'gatsby'
import '../../components/all.sass'
import { useBackgroundStore } from '../../stores/BarCodeStore'
import CssBarcode from '../../components/CssBarcode/CssBarcode'
import Seo from '../../components/Seo'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'

const ProjectIndexPageTemplate = ({ edges }) => {
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore()
  const breakpoints = useBreakpoint()
  const isMobile = breakpoints.sm

  const onMouseEnter = (index) => {
    if (currentHoveredBar !== index && !isMobile) {
      setCurrentHoveredBar(index)
    }
    // haltInterval.current = true
    // setSideImage(getImage(featuredimage) || featuredimage)
  }

  const onMouseLeave = () => {
    if (currentHoveredBar !== null && !isMobile) {
      setCurrentHoveredBar(null)
    }
    // haltInterval.current = false
  }

  const navigateToProject = (slug) => {
    navigate(slug)
  }

  return (
    <>
      <Seo></Seo>
      <Navbar></Navbar>
      <SectionTemplate className="minus-navbar project-index-wrapper">
        <div className="columns fill-container">
          <div className="column fill-container">
            <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container fill-complete-height">
              {/* <HalfPageNavbar /> */}
              {/* date */}
              <div></div>
              <TableLayout>
                {edges.map(({ node }, index) => (
                  <TableRowComponent
                    leftData={node.frontmatter.client}
                    rightData={node.frontmatter.title}
                    onClick={() => navigateToProject(node.fields.slug)}
                    onMouseLeave={onMouseLeave}
                    onMouseEnter={() => onMouseEnter(index)}
                    key={node.id}
                    className={`crossed ${
                      index === currentHoveredBar ? 'active' : ''
                    }`}
                  />
                ))}
              </TableLayout>
            </div>
          </div>
          {/* <PostContent content={content} /> */}
        </div>
        <div className="column is-6 fill-container projects-index-barcode-column">
          {/* <BigImage counter={counter.current} img={sideImage} ></BigImage> */}
          <CssBarcode small></CssBarcode>
        </div>
      </SectionTemplate>
    </>
  )
}

const ProjectIndexPage = () => {
  return (
    <StaticQuery
      query={graphql`
        query ProjectIndexQuery {
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
                  client
                  templateKey
                  date(formatString: "YYYY")
                }
              }
            }
            totalCount
          }
        }
      `}
      render={(data, count) => (
        <ProjectIndexPageTemplate
          totalCount={data.allMarkdownRemark.totalCount}
          edges={data.allMarkdownRemark.edges}
          count={count}
        />
      )}
    />
  )
}

export default ProjectIndexPage
