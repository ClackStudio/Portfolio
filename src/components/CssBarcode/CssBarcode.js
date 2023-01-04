import React, { useState, useEffect, useRef } from 'react'
import { navigate, graphql, StaticQuery } from 'gatsby'
import { useMemoOne } from 'use-memo-one'
import { useBackgroundStore, useBarCodeStore } from '../../stores/BarCodeStore'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'
import BarcodeNumbers from '../BarcodeNumbers/BarcodeNumbers'
import { createBarcodePattern } from './createBarcodePattern'
// import PreviewCompatibleImage from './PreviewCompatibleImage'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'
import { useDrag } from '@use-gesture/react'

import './styles.sass'

const Stripe = ({ black }) => (
  <div className={`css-stripe ${black && 'black'}`}></div>
)
const CssBarPicture = ({ show, featuredimage }) => {
  const [image] = useState(getImage(featuredimage) || featuredimage)
  return (
    <div className={`css-bar-picture`} style={{ opacity: show ? 1 : 0 }}>
      <GatsbyImage
        image={image}
        objectFit={'cover'}
        objectPosition={'center'}
        style={{
          gridArea: '1/1',
          // You can set a maximum height for the image, if you wish.
          height: '100%',
          maxHeight: '100%',
        }}
        alt=""
        layout="fullWidth"
        formats={['auto', 'webp', 'avif']}
      />
    </div>
  )
}
const CssBarVideo = ({ show, src }) => {
  return (
    <div className="css-bar-picture" style={{ opacity: show ? 1 : 0 }}>
      <video muted autoPlay loop playsInline>
        <source type="video/mp4" src={src}></source>
      </video>
    </div>
  )
}

const CssBar = ({
  project,
  projects,
  index,
  numberOfBars,
  barcodeRef,
  barcodePattern,
  small,
}) => {
  const breakpoints = useBreakpoint();
  const isMobile = breakpoints.sm;
  const barRef = useRef();
  const isFeaturedVideo = project.node.frontmatter.featuredVideo;

  const flex = {
    mobile: 4,
    desktop: 2.3,
    closed: 1,
  };

  // const timeoutRef = useRef(null)

  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore();
  const { getNormalisedImageWidth } = useBarCodeStore();

  const stripePattern = useMemoOne(
    () =>
      !small && barcodePattern
        ? barcodePattern
        : createBarcodePattern(index, numberOfBars, small),
    [small, barcodePattern]
  );
  const slug = project.node.fields.slug;
  const isHovering = currentHoveredBar === index;
  const handleClick = () => {
    // clearTimeout(timeoutRef.current)
    // timeoutRef.current = setTimeout(setCurrentHoveredBar(null),500)

    navigate(slug);
  };
  const handleHover = (index) => setCurrentHoveredBar(index);
  useEffect(() => {
    // console.log(flexGrowCa t, projects, normalisedImageWidth))
    getNormalisedImageWidth(barRef.current.clientHeight, isMobile);
  }, [project, isMobile, getNormalisedImageWidth]);

  // const flexGrowCalc = (barcode, projects, normalisedImageWidth) => {
  //   const flexElements = projects.length
  //   const padding = 2 * 10
  //   const totalWidth = barcode.clientWidth - padding
  //   const widthOfOneFlex = totalWidth / flexElements
  // }
  return (
    <div
      className={`css-bar ${currentHoveredBar === index ? "open" : ""}`}
      ref={barRef}
      onClick={handleClick}
      onPointerOver={(e) => (e.stopPropagation(), handleHover(index))}
      onPointerOut={(e) => {
        // the last touched element shall stay open, on desktop it resets
        if (!isMobile) handleHover(null);
      }}
      // style={{width: isHovering ? normalisedImageWidth + "px" : "auto", maxWidth: isHovering ? normalisedImageWidth + "px" : "auto",flex: isHovering ? "1 1 auto" : "1 1 auto"}}
      style={{
        flex: isHovering
          ? isMobile
            ? flex.mobile
            : flex.desktop
          : flex.closed,
      }}
    >
      {isFeaturedVideo ? (
        <CssBarVideo
          show={currentHoveredBar === index}
          src={project.node.frontmatter.featuredVideo.publicURL}
        ></CssBarVideo>
      ) : (
        <CssBarPicture
          show={currentHoveredBar === index}
          featuredimage={project.node.frontmatter.featuredimage}
        ></CssBarPicture>
      )}

      {stripePattern.map((value, i) => (
        <Stripe key={index + "stripe" + i} black={value === 1}></Stripe>
      ))}
    </div>
  );
};

const CssBarcodeTemplate = ({ data, small, wrapperStyle }) => {
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore();
  const { barcodePattern, requestBarcodePattern, smallBarCodePattern } =
    useBarCodeStore();
  const breakpoints = useBreakpoint();
  const isMobile = breakpoints.sm;
  const saved = useRef(0);

  const barcodeRef = useRef();
  const { edges: projects } = data.allMarkdownRemark;
  const onlyFeaturedProjects = small
    ? projects
    : projects.filter((project) => project.node.frontmatter.featuredproject);
  useMemoOne(
    () => requestBarcodePattern(onlyFeaturedProjects.length),
    [onlyFeaturedProjects.length]
  );

  const bind = useDrag(
    ({ down, movement: [mx, my], velocity: [vx, vy], direction: [dx, dy] }) => {
      if (isMobile) {
        const isFirst = currentHoveredBar === 0;
        const isLast = currentHoveredBar === onlyFeaturedProjects.length - 1;

        const directionalAdd = () => {
          if (dy > 0) {
            if (!isLast) {
              return 1;
            }
          } else {
            if (!isFirst) {
              return -1;
            }
          }
          return 0;
        };
        const velocityCalc = (velocity) => {
          saved.current = saved.current + velocity;
          if (saved.current > 2) {
            setCurrentHoveredBar(currentHoveredBar + directionalAdd());
            saved.current = 0;
          }
        };
        // const movementThreshold = 40
        // const velocityThreshold = 0

        velocityCalc(vy);
        // if (my > movementThreshold && vy > velocityThreshold) {

        //   setCurrentHoveredBar(currentHoveredBar + directionalAdd())
        // }
        // console.log("VELOCITY", vy)
      }
    }
  );
  // home page
  return (
    <div
      className={`css-barcode-wrapper ${small ? `small` : ``}`}
      style={wrapperStyle}
      {...bind()}
    >
      <div
        className={`css-barcode ${small ? `small` : ``}  ${
          breakpoints.sm && "mobile-css-barcode"
        }`}
        ref={barcodeRef}
      >
        {onlyFeaturedProjects.map((project, i) => (
          <CssBar
            small={small}
            barcodeRef={barcodeRef}
            barcodePattern={barcodePattern.length > 0 ? barcodePattern[i] : []}
            index={i}
            key={`css-bar-${i}`}
            project={project}
            numberOfBars={projects.length}
          />
        ))}
      </div>
      {!small && (
        <BarcodeNumbers projects={onlyFeaturedProjects}></BarcodeNumbers>
      )}
    </div>
  );
};
const CssBarcode = (props) => {
  return (
    <StaticQuery
      query={graphql`
        query CssBarCodeQuery {
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
                  featuredproject
                  featuredVideo {
                    publicURL
                  }
                  featuredimage {
                    childImageSharp {
                      gatsbyImageData(
                        quality: 100
                        width: 1080
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
      render={(data, count) => (
        <CssBarcodeTemplate data={data} count={count} {...props} />
      )}
    />
  );
}

CssBarcode.propTypes = {}

export default CssBarcode
