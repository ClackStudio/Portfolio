import React, { useRef } from "react";
import SectionTemplate from "../../components/SectionTemplate";
import {
  TableLayout,
  TableRowComponent,
} from "../../components/TableComponent";
import Navbar from "../../components/Navbar";
import { graphql, StaticQuery, navigate } from "gatsby";
import "../../components/all.sass";
import { useBackgroundStore } from "../../stores/BarCodeStore";
import CssBarcode from "../../components/CssBarcode/CssBarcode";
import Seo from "../../components/Seo";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { useDrag } from "@use-gesture/react";

const ProjectIndexPageTemplate = ({ edges, descriptionprojects }) => {
  const { setCurrentHoveredBar, currentHoveredBar } = useBackgroundStore();
  const breakpoints = useBreakpoint();
  const isMobile = breakpoints.sm;

  const onMouseEnter = (index) => {
    if (!isMobile) {
      if (currentHoveredBar !== index && !isMobile) {
        setCurrentHoveredBar(index);
      }
    }

    // haltInterval.current = true
    // setSideImage(getImage(featuredimage) || featuredimage)
  };

  const onMouseLeave = () => {
    if (!isMobile) {
      if (currentHoveredBar !== null && !isMobile) {
        setCurrentHoveredBar(null);
      }
    }
    // haltInterval.current = false
  };

  const navigateToProject = (slug) => {
    navigate(slug);
  };

  // Folowing logic is fpor scrolling through projects with the finger
  const saved = useRef(0);

  const bind = useDrag(
    ({
      first,
      last,
      elapsedTime,
      movement: [mx, my],
      velocity: [vx, vy],
      direction: [dx, dy],
      args: [index],
    }) => {
      if (isMobile) {
        if (currentHoveredBar !== index && first) {
          setCurrentHoveredBar(index);
        }
        const isFirst = currentHoveredBar === 0;
        const isLast = currentHoveredBar === edges.length - 1;

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
          if (saved.current > 1 && elapsedTime > 100) {
            setCurrentHoveredBar(currentHoveredBar + directionalAdd());
            saved.current = 0;
          }
          if (last) {
            navigateToProject(edges[currentHoveredBar]?.node?.fields?.slug);
          }
        };

        velocityCalc(vy);
      }
    }
  );

  return (
    <>
      <Seo title={"projects"} description={descriptionprojects}></Seo>
      <Navbar></Navbar>
      <SectionTemplate className="minus-navbar project-index-wrapper">
        <div className="columns fill-container">
          <div className="column fill-container">
            <div className="is-12 is-flex is-flex-direction-column is-justify-content-space-between fill-container fill-complete-height extra-top-padding">
              {/* <HalfPageNavbar /> */}
              {/* date */}
              <div></div>
              <div style={{ touchAction: "none" }}>
                <TableLayout>
                  {edges.map(({ node }, index) => (
                    <div
                      {...bind(index)}
                      key={`AnimationWrapperDiv__${index}`}
                      style={{ touchAction: "none" }}
                    >
                      <TableRowComponent
                        leftData={node.frontmatter.client}
                        rightData={node.frontmatter.title}
                        onClick={() => navigateToProject(node.fields.slug)}
                        onMouseLeave={onMouseLeave}
                        onMouseEnter={() => onMouseEnter(index)}
                        key={node.id}
                        leftMaxWidth={isMobile ? "40%" : "50%"}
                        className={`crossed ${
                          index === currentHoveredBar ? "active" : ""
                        } ${isMobile ? "faster-hover" : ""}`}
                      />
                    </div>
                  ))}
                </TableLayout>
              </div>
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
  );
};

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
          about: markdownRemark(fields: { slug: { eq: "/about/" } }) {
            fields {
              slug
            }
            frontmatter {
              title
              descriptionprojects
            }
          }
        }
      `}
      render={(data, count) => (
        <ProjectIndexPageTemplate
          totalCount={data.allMarkdownRemark.totalCount}
          edges={data.allMarkdownRemark.edges}
          count={count}
          descriptionprojects={data.about.frontmatter.descriptionprojects}
        />
      )}
    />
  );
};

export default ProjectIndexPage;
