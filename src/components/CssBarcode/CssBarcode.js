import React, {useState, Suspense, useEffect, useRef, useCallback} from 'react'
import { Link, navigate, graphql, StaticQuery } from 'gatsby'
import { useMemoOne } from 'use-memo-one'
import { useBackgroundStore, useBarCodeStore } from '../../stores/BarCodeStore'
import { getImage, GatsbyImage } from 'gatsby-plugin-image'
import BarcodeNumbers from '../BarcodeNumbers/BarcodeNumbers'
import BigImage from '../BigImage'
import { createBarcodePattern } from './createBarcodePattern'
// import PreviewCompatibleImage from './PreviewCompatibleImage'
import './styles.sass'

const Stripe = ({black}) => (
    <div  className={`css-stripe ${black && 'black'}`}></div>
  )
const CssBarPicture = ({show, featuredimage}) => {
  const [image, setImage] = useState(getImage(featuredimage) || featuredimage);
  return (
    <div className='css-bar-picture' style={{opacity: show ? 1 : 0}}>
      <GatsbyImage
          image={image}
          objectFit={"cover"}
          objectPosition={"center"}
          style={{
            gridArea: "1/1",
            // You can set a maximum height for the image, if you wish.
            height: "100%",
            maxHeight: "100%",
          }}
          layout="fullWidth"
          formats={["auto", "webp", "avif"]}
        />
    </div> 
)
}

const CssBar = ({project, projects, index, numberOfBars, isMobile, barcodeRef, barcodePattern, small}) => {
    const barRef = useRef()

    const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore()
    const { getNormalisedImageWidth, normalisedImageWidth } = useBarCodeStore()

    const stripePattern = useMemoOne( () => (!small && barcodePattern) ? barcodePattern : createBarcodePattern(index, numberOfBars), [small, barcodePattern])


    const slug = project.node.fields.slug
    const isHovering = currentHoveredBar === index
    const handleClick = () => navigate(slug)
    const handleHover = (index) => setCurrentHoveredBar(index)
    useEffect(()=> {
      // console.log(flexGrowCalc(barcodeRef.current, projects, normalisedImageWidth))
      getNormalisedImageWidth(barRef.current.clientHeight, isMobile)
    }, [project, isMobile])


    // const flexGrowCalc = (barcode, projects, normalisedImageWidth) => {
    //   const flexElements = projects.length
    //   const padding = 2 * 10
    //   const totalWidth = barcode.clientWidth - padding
    //   const widthOfOneFlex = totalWidth / flexElements
    // }
    return (
        <div className="css-bar" 
        ref={barRef}
        onClick={handleClick}
        onPointerOver={(e) => (e.stopPropagation(), handleHover(index))}
        onPointerOut={(e) => handleHover(null)}
        // style={{width: isHovering ? normalisedImageWidth + "px" : "auto", maxWidth: isHovering ? normalisedImageWidth + "px" : "auto",flex: isHovering ? "1 1 auto" : "1 1 auto"}}
        style={{flex: isHovering ? 2.3 : "1"}}

        >
        <CssBarPicture show={currentHoveredBar === index} featuredimage={project.node.frontmatter.featuredimage} ></CssBarPicture>
            { stripePattern.map((value, i) => <Stripe key={index + "stripe" + i} black={value === 1}></Stripe>)}
        </div>
    )
}



const CssBarcodeTemplate = ({data, small}) => {
  const { barcodePattern, requestBarcodePattern } = useBarCodeStore()
  const barcodeRef = useRef()
  const { edges: projects } = data.allMarkdownRemark
  const onlyFeaturedProjects = small ? projects : projects.filter((project) => project.node.frontmatter.featuredproject)
  useMemoOne(() => requestBarcodePattern(onlyFeaturedProjects.length),[onlyFeaturedProjects.length])
    // home page
    return (
      <div className="css-barcode-wrapper">
        <div className={`css-barcode ${small ? `small` : ``}`} ref={barcodeRef}>
          { onlyFeaturedProjects.map((project, i) => <CssBar small={small} barcodeRef={barcodeRef} barcodePattern={barcodePattern.length > 0 ? barcodePattern[i] : []} index={i} key={`css-bar-${i}`} project={project} numberOfBars={projects.length}/>)}
        </div> 
        { !small && (<BarcodeNumbers projects={onlyFeaturedProjects}></BarcodeNumbers>) }
      </div>
    ) 
}
const CssBarcode = ({small}) => {
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
                  templateKey
                  date(formatString: "YYYY")
                  featuredproject
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
      render={(data, count) => <CssBarcodeTemplate small={small} data={data} count={count} />}
    />
  );
}


CssBarcode.propTypes = {

}

export default CssBarcode
