import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { kebabCase } from "lodash";
import { Helmet } from "react-helmet";
import { graphql, Link } from "gatsby";
import createScrollSnap from 'scroll-snap'

import HalfPageNavbar from "../components/HalfPageNavbar";
import ProjectNavigation from "../components/ProjectNavigation";

import Content, { HTMLContent } from "../components/Content";
import { getImage } from "gatsby-plugin-image";
import { TableLayout, TableRowComponent } from '../components/TableComponent'
import SectionTemplate from "../components/SectionTemplate";
import './styles.sass'


import BigImage from "../components/BigImage";


const TitleTemplate = ({ title, className }) => (
  <div className={'columns' + className}>
    <div className="column is-6 project-title">
      {title}
    </div>
  </div>
)

const ServicesListTemplate = ({ services }) => (
  <div className="columns">

    <div className="column is-6 meta-title">
      services
    </div>
    <div className="column is-6 meta-data">
      {services && services.length ? (
        <ul className="services-list">
          {services.map((service) => (
            <li className="meta-data-point" key={service + `services`}>
              <Link to={`/tags/${kebabCase(service)}/`}>{service}</Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  </div>
)

const Section = ({ data }) => {
  const isHorizontal = data[0].image.horizontal
  const firstImage = getImage(data[0].image.src) || data[0].image.src;
  const isLeft = data[0].image.left
  const twoImages = data.length > 1
  const secondImage = twoImages ? getImage(data[1].image.src) || data[1].image.src : false
  // const heroImage = getImage(image) || image;


  return (
    <SectionTemplate>
      {isHorizontal ? (
        <div className="columns fill-container">
          <div className="column is-12">
            <BigImage img={firstImage} ></BigImage>
          </div>
        </div>
      ) : (
        <div className="columns fill-container">

          <div className="column is-6">
            {isLeft && (<BigImage img={firstImage} ></BigImage>)}
          </div>
          <div className="column is-6">
            {!isLeft && (<BigImage img={firstImage} ></BigImage>)}
            {secondImage && (<BigImage img={secondImage} ></BigImage>)}
          </div>
        </div>
      )
      }
    </SectionTemplate>)

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
  const PostContent = contentComponent || Content;
  const firstImage = featuredImage && (getImage(featuredImage) || featuredImage)
  const lastSectionImage = lastImage && (getImage(lastImage) || lastImage)

  // const scrollContainer = useRef();
  // const bindScrollSnap = () => {
  //   const element = scrollContainer.current

  //   createScrollSnap(
  //     element, {
  //     snapDestinationY: '100%',
  //     threshold: 0,
  //     duration: 0,

  //   }, () => console.log('snapped'))
  // }

  // useEffect(() => {
  //   bindScrollSnap()
  // }, [])

  return (
    <div className="scroll-container">
      {helmet || ""}
      <SectionTemplate>
        <div className="columns fill-container" >

          <div className="column fill-container">
            <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container" >
              <HalfPageNavbar />
              {/* date */}
              <TableLayout>
                <TableRowComponent leftData={"client"} rightData={client} />
                {additionalData && additionalData.map(({ title, data }, index) => (
                  <TableRowComponent leftData={title} rightData={data} key={`key_add_data_${index}`} />

                ))}
                <TableRowComponent leftData={"date"} rightData={date} />
                <ServicesListTemplate services={tags} />
                <TitleTemplate title={title} className={'pt-5'} ></TitleTemplate>
              </TableLayout>
            </div>
          </div>

          {/* <PostContent content={content} /> */}

        </div>
        <div className="column is-6 fill-container">
          <BigImage img={firstImage} ></BigImage>
        </div>
      </SectionTemplate>

      {sections && sections.length ?
        sections.map(({ section }, index) => <Section data={section} key={`section_${index}`}></Section>)
        : null}

      {/* FINAL SECTION */}
      <SectionTemplate>
        <div className="columns fill-container">
          <div className="column is-6 fill-container">
            <BigImage img={lastSectionImage} ></BigImage>
          </div>
          <div className="column is-6 is-flex is-flex-direction-column fill-container">
            <HalfPageNavbar />
            <div className="is-flex is-justify-content-space-between is-flex-direction-column" style={{ height: "100%" }}>
              <TableLayout>
                <PostContent content={content} />
              </TableLayout>
              <ProjectNavigation currentProjectId={id} />
            </div>
          </div>
        </div>
      </SectionTemplate>
    </div>
  );
};

ProjectPostTemplate.propTypes = {
  content: PropTypes.node.isRequired,
  contentComponent: PropTypes.func,
  description: PropTypes.string,
  title: PropTypes.string,
  helmet: PropTypes.object,
};

const ProjectPost = ({ data, location }) => {
  const { markdownRemark: post } = data;

  return (
    // <Layout location={location}>
    <ProjectPostTemplate
      id={post.id}
      content={post.html}
      contentComponent={HTMLContent}
      description={post.frontmatter.description}
      sections={post.frontmatter.sections}
      lastImage={post.frontmatter.lastImage}
      client={post.frontmatter.client}
      additionalData={post.frontmatter.additionalData}
      featuredImage={post.frontmatter.featuredimage}
      date={post.frontmatter.date}
      helmet={<Helmet titleTemplate="%s | Blog">
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
  );
};

ProjectPost.propTypes = {
  data: PropTypes.shape({
    markdownRemark: PropTypes.object,
  }),
};

export default ProjectPost;

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
        lastImage {
          childImageSharp {
            gatsbyImageData(quality: 100, layout: FULL_WIDTH)
          }
        }
        sections {
          section {
            image {
              left
              horizontal
              altText
              src {
                childImageSharp {
                  gatsbyImageData(quality: 100, layout: FULL_WIDTH)
                }
              }
            }
          }
        }
      }
    }
  }
`;
