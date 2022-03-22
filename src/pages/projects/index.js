import React, { useRef, useEffect, useState } from "react";

import SectionTemplate from "../../components/SectionTemplate";
import { TableLayout, TableRowComponent } from "../../components/TableComponent";
import { helmet } from "react-helmet";
import HalfPageNavbar from "../../components/HalfPageNavbar";
import BigImage from "../../components/BigImage";
import { Link, graphql, StaticQuery, navigate } from 'gatsby'
import { getImage } from "gatsby-plugin-image";
import '../../components/all.sass'
import { useBackgroundStore } from "../../stores/BarCodeStore";
import ProjectBarCode from "../../components/ProjectBarCode/ProjectBarCode";


const ProjectIndexPageTemplate = ({location, edges, totalCount}) => {
  const { setCurrentHoveredBar, currentHoveredBar} = useBackgroundStore()
  // const counter = useRef(0)
  // const haltInterval = useRef(false)

  // const [sideImage, setSideImage] = useState(getImage(edges[6].node.frontmatter.featuredimage) || edges[6].node.frontmatter.featuredimage);

  // useEffect(() => {
  //   const interval = setInterval(() => {
      
  //     if (counter.current < totalCount - 1) counter.current++
  //     else counter.current = 0

  //     if (!haltInterval.current) setSideImage(getImage(edges[counter.current].node.frontmatter.featuredimage) || edges[counter.current].node.frontmatter.featuredimage)
  //   }, 2500);
  //   return () => clearInterval(interval);
  // }, []);

  const onMouseEnter = (index) => {
    if (currentHoveredBar !== index) {
      console.log("INDEX", index)
      console.log("currentHoveredBar", currentHoveredBar)
      setCurrentHoveredBar(index)
    }
    // haltInterval.current = true
    // setSideImage(getImage(featuredimage) || featuredimage)
  }

  const onMouseLeave = () => {
    if (currentHoveredBar !== null) {
    setCurrentHoveredBar(null)
    }
    // haltInterval.current = false
  }

  const navigateToProject = (slug) => {
    navigate(slug)
  }



  return (
    <>
      {helmet || ""}
      <SectionTemplate>
          <div className="columns fill-container">
            <div className="column fill-container">
              <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container" >
                <HalfPageNavbar />
                {/* date */}
                <TableLayout>
                  {edges.map(({node}, index) => (
                  <TableRowComponent 
                  leftData={node.frontmatter.client}
                  rightData={node.frontmatter.title} 
                  onClick={() => navigateToProject(node.fields.slug)}
                  onMouseLeave={onMouseLeave} 
                  onMouseEnter={() => onMouseEnter(index)} 
                  key={node.id} 
                  className={'crossed'} />
                  ))}
                
                </TableLayout>
              </div>
            </div>
            {/* <PostContent content={content} /> */}

          </div>
          <div className="column is-6 fill-container">
            {/* <BigImage counter={counter.current} img={sideImage} ></BigImage> */}
            <ProjectBarCode projectsIndex></ProjectBarCode>

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
      render={(data, count) => <ProjectIndexPageTemplate totalCount={data.allMarkdownRemark.totalCount} edges={data.allMarkdownRemark.edges} count={count} />}
    />
  );
}

export default ProjectIndexPage