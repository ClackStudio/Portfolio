import React from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import Navbar from '../components/Navbar'
import ProjectNavigation from '../components/ProjectNavigation'
import BigImage from '../components/BigImage'
import ScrollArrow from '../components/ScrollArrow'
import Content, { HTMLContent } from '../components/Content'
import { getImage } from 'gatsby-plugin-image'
import { TableLayout, TableRowComponent } from '../components/TableComponent'
import SectionTemplate from '../components/SectionTemplate'
import './styles.sass'

const ServicesListTemplate = ({ services }) => (
  <div className="columns">
    <div className="column is-6 meta-title">services</div>
    <div className="column is-6 meta-data">
      {services && services.length ? (
        <ul className="services-list">
          {services.map((service) => (
            <li className="meta-data-point" key={service + `services`}>
              {service}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  </div>
)

const FillingVideo = ({ src }) => (
  <video muted autoPlay="autoplay" loop playsInline>
    <source type="video/mp4" src={src}></source>
  </video>
)

const Section = ({ data, className }) => {
  const isHorizontal = data.horizontal
  const firstImage = getImage(data.src) || data.src
  const isLeft = data.left
  const secondImage = getImage(data.secondImageSrc) || data.secondImageSrc
  const videoData = data.video
  // const heroImage = getImage(image) || image;
  return (
    <SectionTemplate className={className}>
      {isHorizontal ? (
        <div className="columns fill-container">
          <div className="column is-12">
            {videoData ? (
              <FillingVideo src={videoData.publicURL}></FillingVideo>
            ) : (
              <BigImage img={firstImage}></BigImage>
            )}
          </div>
        </div>
      ) : (
        <div className="columns fill-container">
          <div
            className="column is-6 project-column"
            style={{ position: 'relative' }}
          >
            {isLeft && videoData && (
              <FillingVideo src={videoData.publicURL}></FillingVideo>
            )}
            {isLeft && !videoData && <BigImage img={firstImage}></BigImage>}
          </div>
          <div
            className="column is-6 project-column"
            style={{ position: 'relative' }}
          >
            {!isLeft && videoData && (
              <FillingVideo src={videoData.publicURL}></FillingVideo>
            )}
            {!isLeft && !videoData && <BigImage img={firstImage}></BigImage>}
            {secondImage && !videoData && (
              <BigImage img={secondImage}></BigImage>
            )}
          </div>
        </div>
      )}
    </SectionTemplate>
  )
}

// eslint-disable-next-line
export const ProjectPostTemplate = ({
  id,
  content,
  contentComponent,
  description,
  date,
  tags,
  client,
  additionalData,
  lastImage,
  title,
  helmet,
  featuredImage,
  sections,
}) => {
  const PostContent = contentComponent || Content
  const firstImage = featuredImage && (getImage(featuredImage) || featuredImage)
  const lastSectionImage = lastImage && (getImage(lastImage) || lastImage)
  const breakpoints = useBreakpoint()
  const projectRef = React.useRef(null)

  return (
    <div
      ref={projectRef}
      style={{ touchAction: 'pan-y' }}
      className={`scroll-container ${
        breakpoints.sm && 'mobile-scroll-container'
      }`}
    >
      {helmet || ''}
      <SectionTemplate
        innerClassName="minus-navbar first-section"
        placeOnTop={<Navbar></Navbar>}
      >
        <div className="columns fill-container">
          <div className="column fill-container">
            <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container is-postion-relative project-info">
              <div></div>
              <ScrollArrow />
              <TableLayout>
                <TableRowComponent leftData={'client'} rightData={client} />
                <TableRowComponent leftData={'project'} rightData={title} />
                {additionalData &&
                  additionalData.map(({ title, data }, index) => (
                    <TableRowComponent
                      leftData={title}
                      rightData={data}
                      key={`key_add_data_${index}`}
                    />
                  ))}
                <TableRowComponent leftData={'date'} rightData={date} />
                <ServicesListTemplate services={tags} />
                {/* <TitleTemplate title={title} className={'pt-5'} ></TitleTemplate> */}
              </TableLayout>
            </div>
          </div>

          {/* <PostContent content={content} /> */}
        </div>
        <div className="column is-6 fill-container project-first-image">
          <BigImage img={firstImage}></BigImage>
        </div>
      </SectionTemplate>

      {sections && sections.length
        ? sections.map((section, index) => (
            <Section data={section} key={`section_${index}`}></Section>
          ))
        : null}

      {/* FINAL SECTION */}
      <SectionTemplate>
        <div className="columns fill-container">
          <div className="column is-6 fill-container">
            <BigImage img={lastSectionImage}></BigImage>
          </div>
          <div className="column is-6 is-flex is-flex-direction-column fill-container">
            {/* <Navbar halfpage /> */}
            <div
              className="is-flex is-justify-content-space-between is-flex-direction-column"
              style={{ height: '100%' }}
            >
              <TableLayout>
                <PostContent content={content} />
              </TableLayout>
              <ProjectNavigation ref={projectRef} currentProjectId={id} />
            </div>
          </div>
        </div>
      </SectionTemplate>
    </div>
  )
}

ProjectPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
}

const ProjectPost = ({ data, location }) => {
  const { markdownRemark: post } = data
  return (
    // <Layout location={location}>
    <ProjectPostTemplate
      id={post.id}
      content={post.html}
      contentComponent={HTMLContent}
      description={post.frontmatter.description}
      sections={post.frontmatter.section}
      lastImage={post.frontmatter.lastImage}
      client={post.frontmatter.client}
      additionalData={post.frontmatter.additionalData}
      featuredImage={post.frontmatter.featuredimage}
      videoSrc={post.frontmatter.publicURL}
      date={post.frontmatter.date}
      helmet={
        <Helmet titleTemplate="%s | Blog">
          <title>{`${post.frontmatter.title}`}</title>
          <meta
            name="description"
            content={`${post.frontmatter.description}`}
          />
        </Helmet>
      }
      tags={post.frontmatter.tags}
      title={post.frontmatter.title}
    />
    // </Layout>
  )
}

ProjectPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
}

export default ProjectPost

export const pageQuery = graphql`
  query ProjectPostByID($id: String!) {
    markdownRemark(id: { eq: $id }) {
      id
      html
      frontmatter {
        date(formatString: "YYYY")
        title
        description
        client
        additionalData {
          title
          data
        }
        tags
        featuredimage {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        featuredVideo {
          publicURL
        }
        lastImage {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        section {
          left
          horizontal
          altText
          src {
            childImageSharp {
              gatsbyImageData(quality: 100, layout: FULL_WIDTH)
            }
          }
          secondImageSrc {
            childImageSharp {
              gatsbyImageData(quality: 100, layout: FULL_WIDTH)
            }
          }
          video {
            publicURL
            relativePath
          }
        }
      }
    }
  }
`
