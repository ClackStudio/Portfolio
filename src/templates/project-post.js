import React, {useState} from 'react'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import { graphql } from 'gatsby'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import Navbar from '../components/Navbar'
import NewProjectNavigation from '../components/NewProjectNavigation'
import BigImage from '../components/BigImage'
import ScrollArrow from '../components/ScrollArrow'
import Content, { HTMLContent } from '../components/Content'
import { getImage } from 'gatsby-plugin-image'
import { TableLayout, TableRowComponent } from '../components/TableComponent'
import SectionTemplate from '../components/SectionTemplate'
import './styles.sass'
import { useBackgroundStore } from '../stores/BarCodeStore'
import Seo from '../components/Seo'
import { useScroll } from '@use-gesture/react'
import VideoIFrame from "../components/VideoIFrame";

const ServicesListTemplate = ({ services }) => (
  <div className="columns">
    <div className="column is-6 meta-title">services</div>
    <div className="column is-6 meta-data">
      {services && services.length ? (
        <ul className="services-list">
          {services.map(
            (service, index) =>
              service + `${index !== services.length - 1 ? ", " : ""}`
            // <li className="meta-data-point" key={service + `services`}>
            //   {service}
            // </li>
          )}
        </ul>
      ) : null}
    </div>
  </div>
);

const FillingVideo = ({ src, centered }) => (
  <video
    muted
    autoPlay
    loop
    playsInline
    style={{ objectFit: centered ? "contain" : "cover" }}
  >
    <source type="video/mp4" src={src}></source>
  </video>
);

const IndicatorDot = ({ on, black }) => (
  <div
    className={`
  indicator-dot
  ${on ? "active" : null}
  `}
  >
    {" "}
  </div>
);
const ScrollIndicator = ({ slideNumber, black }) => {
  return (
    <div
      className={`
    scroll-indicator
    ${black ? "black" : "white"}
    `}
    >
      <IndicatorDot on={slideNumber === 0} />
      <IndicatorDot on={slideNumber === 1} />
    </div>
  );
};

const MultiplePictureWrapper = ({ children, slider, black }) => {
  const [slideNumber, setSlideNumber] = useState(0);
  const bind = useScroll(
    ({ values: [x, y] }) => {
      const middle = 200;
      if (x > middle && slideNumber === 0) {
        setSlideNumber(1);
      }
      if (x < middle && slideNumber === 1) {
        setSlideNumber(0);
      }
    },
    {
      axis: "x",
    }
  );

  return (
    <div {...bind()} className="columns fill-container">
      {slider && (
        <ScrollIndicator
          slideNumber={slideNumber}
          black={black}
        ></ScrollIndicator>
      )}
      {children}
    </div>
  );
};

const Section = ({ data, className }) => {
  const {
    src,
    secondImage = null,
    video = null,
    left = false,
    horizontal = false,
    centeredFirst = false,
    centeredFirstMobile = false,
    centeredSecond = false,
    centeredSecondMobile = false,
    altText = "portfolio image",
    altTextSecond = "another portfolio image",
    embeddedVideo = false,
  } = data;
  console.log("dataatatatat", data);
  const firstImage = getImage(data.src) || data.src;
  const secondImageSrc = getImage(data.secondImage) || data.secondImage;
  // console.log("CENTERED", centerd)
  return (
    <SectionTemplate
      className={`${className} ${
        (secondImage || left) && !horizontal && !embeddedVideo
          ? "mobile-flip-section"
          : ""
      }`}
    >
      {horizontal || embeddedVideo ? (
        <div className="columns fill-container horizontal">
          {embeddedVideo ? (
            <div className={`column is-12 centered`} style={{ margin: "auto" }}>
              <VideoIFrame url={embeddedVideo}></VideoIFrame>
            </div>
          ) : (
            <div
              className={`column is-12 ${
                centeredFirstMobile ? "centered-mobile" : ""
              } ${centeredFirst ? "centered" : ""}`}
            >
              {video ? (
                <FillingVideo
                  src={video.publicURL}
                  altText={altText}
                  centered={centeredFirst}
                ></FillingVideo>
              ) : (
                <BigImage
                  className="project-picture"
                  img={firstImage}
                  altText={altText}
                  objectFit={centeredFirst ? "contain" : "cover"}
                ></BigImage>
              )}
            </div>
          )}
        </div>
      ) : (
        <MultiplePictureWrapper
          slider={secondImage && true}
          black={centeredFirst || centeredSecond}
        >
          <div
            className={`column is-6 project-column 
            ${
              centeredFirstMobile && (left || secondImage)
                ? "centered-mobile"
                : ""
            }
            ${centeredFirst && (left || secondImage) ? "centered" : ""}
            ${!left && !secondImage ? `hide-column-mobile` : "not-hidden?"}
            `}
            style={{ position: "relative" }}
          >
            {left && video && (
              <FillingVideo
                src={video.publicURL}
                altText={altText}
                centered={centeredFirst}
              ></FillingVideo>
            )}
            {(left || secondImage) && !video && (
              <BigImage
                className="project-picture"
                img={firstImage}
                altText={altText}
                objectFit={centeredSecond ? "contain" : "cover"}
              ></BigImage>
            )}
          </div>
          <div
            className={`column is-6 project-column 
            ${
              left && !video && !secondImage
                ? `hide-column-mobile`
                : "not-hidden?"
            }
            ${
              ((secondImage || video) && centeredSecond) ||
              (!secondImage && centeredFirst)
                ? "centered"
                : ""
            }
            ${
              ((secondImage || video) && centeredSecondMobile) ||
              (!secondImage && centeredFirstMobile)
                ? "centered-mobile"
                : ""
            }
            `}
            style={{ position: "relative" }}
          >
            {!left && video && (
              <FillingVideo
                src={video.publicURL}
                altText={altText}
                centered={centeredFirst}
              ></FillingVideo>
            )}
            {!left && !video && !secondImage && (
              <BigImage
                className="project-picture"
                altText={altText}
                img={firstImage}
                objectFit={
                  centeredSecond || (!secondImage && centeredFirst)
                    ? "contain"
                    : "cover"
                }
              ></BigImage>
            )}
            {secondImage && !video && (
              <BigImage
                img={secondImageSrc}
                altText={altTextSecond}
                className="second-image project-picture"
                objectFit={
                  centeredSecond || (!secondImage && centeredFirst)
                    ? "contain"
                    : "cover"
                }
              ></BigImage>
            )}
          </div>
        </MultiplePictureWrapper>
      )}
    </SectionTemplate>
  );
};

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
  featuredVideo,
  centeredFirstImage,
  centeredFirstImageMobile,
  centeredLastImage,
  centeredLastImageMobile,
  sections,
}) => {
  const PostContent = contentComponent || Content;
  const firstImage =
    featuredImage && (getImage(featuredImage) || featuredImage);
  const lastSectionImage = lastImage && (getImage(lastImage) || lastImage);
  const breakpoints = useBreakpoint();
  const projectRef = React.useRef(null);
  const isMobile = breakpoints.sm;
  const { setCurrentHoveredBar } = useBackgroundStore();

  React.useEffect(() => {
    // reset hovered
    setCurrentHoveredBar(null);
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <div
        ref={projectRef}
        style={{ touchAction: "pan-y" }}
        className={`scroll-container ${isMobile && "mobile-scroll-container"}`}
      >
        <Seo
          description={`${client} ${title} ${date}`}
          featuredImage={firstImage}
        ></Seo>
        <SectionTemplate innerClassName=" first-section">
          <div className="columns fill-container project-info-wrapper">
            <div className="column fill-container ">
              <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container is-postion-relative project-info">
                <div></div>
                <ScrollArrow />
                <TableLayout>
                  <TableRowComponent
                    noCrossLine
                    leftData={"client"}
                    rightData={client}
                  />
                  <TableRowComponent
                    noCrossLine
                    leftData={"project"}
                    rightData={title}
                  />
                  {additionalData &&
                    additionalData.map(({ title, data }, index) => (
                      <TableRowComponent
                        noCrossLine
                        leftData={title}
                        rightData={data}
                        key={`key_add_data_${index}`}
                      />
                    ))}
                  <TableRowComponent
                    noCrossLine
                    leftData={"date"}
                    rightData={date}
                  />
                  {!isMobile && <ServicesListTemplate services={tags} />}
                  {/* <TitleTemplate title={title} className={'pt-5'} ></TitleTemplate> */}
                </TableLayout>
              </div>
            </div>

            {/* <PostContent content={content} /> */}
          </div>
          <div
            className={`column is-6 fill-container project-first-image
            ${centeredFirstImage ? "centered" : ""}
            ${centeredFirstImageMobile ? "centered-mobile" : ""}
          `}
          >
            {featuredVideo ? (
              <FillingVideo
                src={featuredVideo.publicURL}
                centered={
                  (centeredFirstImage && !isMobile) ||
                  (centeredFirstImageMobile && isMobile)
                    ? true
                    : false
                }
              ></FillingVideo>
            ) : (
              <BigImage
                img={firstImage}
                objectFit={
                  (centeredFirstImage && !isMobile) ||
                  (centeredFirstImageMobile && isMobile)
                    ? "contain"
                    : "cover"
                }
              ></BigImage>
            )}
          </div>
        </SectionTemplate>

        {sections && sections.length
          ? sections.map((section, index) => (
              <Section data={section} key={`section_${index}`}></Section>
            ))
          : null}

        {/* FINAL SECTION */}
        <SectionTemplate>
          <div className="columns fill-container mobile-flex-column">
            <div
              className={`column is-6 fill-container last-section
            ${centeredLastImage ? "centered" : ""}
            ${centeredLastImageMobile ? "centered-mobile" : ""}
            `}
            >
              <BigImage
                img={lastSectionImage}
                objectFit={
                  (centeredLastImage && !isMobile) ||
                  (centeredLastImageMobile && isMobile)
                    ? "contain"
                    : "cover"
                }
              ></BigImage>
            </div>
            <div className="column is-6 is-flex is-flex-direction-column fill-container last-section-nav">
              <div
                className="is-flex is-justify-content-space-between is-flex-direction-column"
                style={{ height: "100%", overflow: "hidden" }}
              >
                <TableLayout>
                  <PostContent content={content} />
                </TableLayout>
                <NewProjectNavigation ref={projectRef} currentProjectId={id} />
              </div>
            </div>
          </div>
        </SectionTemplate>
      </div>
    </>
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
      sections={post.frontmatter.section}
      lastImage={post.frontmatter.lastImage}
      client={post.frontmatter.client}
      additionalData={post.frontmatter.additionalData}
      featuredImage={post.frontmatter.featuredimage}
      featuredVideo={post.frontmatter.featuredVideo}
      date={post.frontmatter.date}
      centeredFirstImage={post.frontmatter.centeredFirstImage}
      centeredLastImage={post.frontmatter.centeredLastImage}
      centeredFirstImageMobile={post.frontmatter.centeredFirstImageMobile}
      centeredLastImageMobile={post.frontmatter.centeredLastImageMobile}
      embeddedVideo={post.frontmatter.embeddedVideo}
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
        centeredFirstImage
        centeredFirstImageMobile
        centeredLastImage
        centeredLastImageMobile
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
          relativePath
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
          altTextSecond
          centeredFirst
          centeredFirstMobile
          centeredSecond
          centeredSecondMobile
          src {
            childImageSharp {
              gatsbyImageData(quality: 100, layout: FULL_WIDTH)
            }
          }
          secondImage {
            childImageSharp {
              gatsbyImageData(quality: 100, layout: FULL_WIDTH)
            }
          }
          video {
            publicURL
            relativePath
          }
          embeddedVideo
        }
      }
    }
  }
`;
