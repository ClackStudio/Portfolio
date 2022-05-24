import React, { useState } from 'react'
import { graphql, StaticQuery, navigate } from 'gatsby'
import { useDrag } from '@use-gesture/react'
import { useBreakpoint } from 'gatsby-plugin-breakpoints'

const ProjectNumber = ({ project, currentProjectId, index }) => {
  const isActiveProject = project.id === currentProjectId
  const goToProject = () => {
    navigate(project.fields.slug)
  }

  return (
    <div
      onClick={goToProject}
      className={`project-number project-navigation-number ${
        isActiveProject && 'active'
      }`}
    >
      {index}
      <div className="vertical-line"></div>
      <div className="horicontal-line"></div>
    </div>
  )
}

const ProjectNavigationTemplate = React.forwardRef(
  ({ projects, currentProjectId }, ref) => {
    const breakpoints = useBreakpoint()
    const isMobile = breakpoints.sm
    const filteredProjects = projects.filter(
      (project) => project.node.frontmatter.featuredproject
    )
    const count = filteredProjects.length
    const [dragged, setDragged] = useState(false)
    const activeProject = filteredProjects.find(
      ({ node }, index) => node.id === currentProjectId
    )
    const activeProjectIndex = filteredProjects.indexOf(activeProject)
    const isFirstProject = activeProjectIndex === 0
    const isLastProject = activeProjectIndex === count - 1
    const previousProject = !isFirstProject
      ? activeProjectIndex - 1
      : activeProjectIndex
    const nextProject = !isLastProject
      ? activeProjectIndex + 1
      : activeProjectIndex

    const goToPreviousProject = () => {
      navigate(filteredProjects[previousProject].node.fields.slug)
    }
    const goToNextProject = () => {
      navigate(filteredProjects[nextProject].node.fields.slug)
    }

    // useDrag(({ event }) => event.preventDefault(), {
    //   target: myRef,
    //   eventOptions: { passive: false }
    // })
    const refWidth = 400

    useDrag(
      ({
        down,
        movement: [mx, my],
        velocity: [vx, vy],
        direction: [dx, dy],
      }) => {
        // console.log("hallo")
        // console.log(ref)
        // console.log(vx)

        const minDraggedDistance = Math.abs(mx) > refWidth / 2

        if (isMobile) {
        if (dx > 0 && minDraggedDistance && !dragged) {
          if (isFirstProject) {
            navigate(
              filteredProjects[filteredProjects.length - 1].node.fields.slug
            )
          } else {
            goToPreviousProject()
          }
          setDragged(true)

          // console.log("previous")
        } else if (vx > 1 && minDraggedDistance && !dragged) {
          if (isLastProject) {
            navigate(filteredProjects[0].node.fields.slug)
          } else {
            goToNextProject()
          }
          setDragged(true)
          // console.log("next")
          // goToNextProject()
        }
        }
      },
      {
        target: ref,
        eventOptions: { passive: false },
      }
    )
    return (
      <div className="project-navigation is-flex is-flex-direction-row is-justify-content-center">
        {/* <CrossButton className="project-navigation-link" onClick={() => goToPreviousProject()}>{!isFirstProject && ("prev")}</CrossButton> */}

        <div className="project-navigation-numbers is-flex is-flex-direction-row">
          {filteredProjects.map(({ node }, index) => (
            <ProjectNumber
              project={node}
              currentProjectId={currentProjectId}
              index={index}
              key={node.id}
            ></ProjectNumber>
          ))}
        </div>

        {/* <CrossButton className="project-navigation-link" onClick={() => goToNextProject()} >{!isLastProject && ("next")}</CrossButton> */}
      </div>
    )
  }
)

// TODO: save this query in cache

const ProjectNavigation = React.forwardRef((props, ref) => {
  return (
    <StaticQuery
      query={graphql`
        query ProjectNavigationQuery {
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
  )
})

export default ProjectNavigation
