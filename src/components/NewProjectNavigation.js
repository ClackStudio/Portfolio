import React, { useState, useRef, useMemo } from "react";
import { graphql, StaticQuery, navigate } from "gatsby";
import { useDrag } from "@use-gesture/react";
import { useBreakpoint } from "gatsby-plugin-breakpoints";
import { ProjectNumber } from "./BarcodeNumbers/BarcodeNumbers";
import { useBackgroundStore } from "../stores/BarCodeStore";

const ProjectNavigationTemplate = React.forwardRef(
  ({ projects, currentProjectId }, ref) => {
    const { setCurrentClickedNumber, currentHoveredBar, setCurrentHoveredBar } =
      useBackgroundStore();
    const breakpoints = useBreakpoint();
    const isMobile = breakpoints.sm;
    const filteredProjects = useMemo(
      () =>
        projects.filter((project) => project.node.frontmatter.featuredproject),
      [projects]
    );
    const count = filteredProjects.length;
    const activeProject = filteredProjects.find(
      ({ node }, index) => node.id === currentProjectId
    );
    const activeProjectIndex = filteredProjects.indexOf(activeProject);
    const isFirstProject = activeProjectIndex === 0;
    const isLastProject = activeProjectIndex === count - 1;
    const previousProject = !isFirstProject
      ? activeProjectIndex - 1
      : activeProjectIndex;
    const nextProject = !isLastProject
      ? activeProjectIndex + 1
      : activeProjectIndex;

    const saved = useRef(0);

    const bind = useDrag(
      ({
        initial,
        down,
        last,
        elapsedTime,
        movement: [mx, my],
        velocity: [vx, vy],
        direction: [dx, dy],
      }) => {
        if (isMobile) {
          const isFirst = currentHoveredBar === 0;
          const isLast = currentHoveredBar === projects.length - 1;

          const directionalAdd = () => {
            if (dx > 0) {
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
            if (saved.current > 0.1 && elapsedTime > 300) {
              setCurrentHoveredBar(currentHoveredBar + directionalAdd());
              // setCurrentClickedNumber(currentHoveredBar + directionalAdd())
              saved.current = 0;
            }
            if (last) {
              setCurrentClickedNumber(currentHoveredBar);
            }
          };
          velocityCalc(vy);
        }
      }
    );
    return (
      <div className="project-navigation barcode-numbers-wrapper is-flex is-flex-direction-row is-justify-content-center">
        {/* <CrossButton className="project-navigation-link" onClick={() => goToPreviousProject()}>{!isFirstProject && ("prev")}</CrossButton> */}

        <div
          className="project-navigation-numbers is-flex is-flex-direction-row"
          {...bind()}
        >
          {filteredProjects.map(({ node }, index) => (
            <ProjectNumber
              project={node}
              index={index}
              key={`barNum_` + node.id}
              isMobile={isMobile}
            ></ProjectNumber>
          ))}
        </div>

        {/* <CrossButton className="project-navigation-link" onClick={() => goToNextProject()} >{!isLastProject && ("next")}</CrossButton> */}
      </div>
    );
  }
);

// TODO: save this query in cache

const NewProjectNavigatio = React.forwardRef((props, ref) => {
  return (
    <StaticQuery
      query={graphql`
        query NewProjectNavigationQuery {
          allMarkdownRemark(
            sort: { order: DESC, fields: [frontmatter___date] }
            filter: { frontmatter: { templateKey: { eq: "project-post" } } }
          ) {
            edges {
              node {
                id
                fields {
                  slug
                }
                frontmatter {
                  featuredproject
                  client
                  title
                }
              }
            }
          }
        }
      `}
      render={(data, count) => (
        <ProjectNavigationTemplate
          {...props}
          projects={data.allMarkdownRemark.edges}
          ref={ref}
        />
      )}
    />
  );
});

export default NewProjectNavigatio;
