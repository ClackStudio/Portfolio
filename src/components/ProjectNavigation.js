import React from 'react'
import { Link, graphql, StaticQuery, navigate } from 'gatsby'
import CrossButton from './CrossButton'
// import './all.sass'
import { node } from 'prop-types'


const ProjectNumber = ({project ,currentProjectId, index}) => {
    const isActiveProject = project.id === currentProjectId
    const goToProject = () => {
        navigate(project.fields.slug)
    }

    return (
        <div onClick={goToProject} className={`project-number ${isActiveProject && 'active'}`} > 
        {index}
            <div className='vertical-line'></div>
            <div className='horicontal-line'></div>
        </div>
    )
}

const ProjectNavigationTemplate = ({projects, count, currentProjectId}) => {
    const activeProject = projects.find(({node}, index) => node.id === currentProjectId)
    const activeProjectIndex = projects.indexOf(activeProject)
    const isFirstProject = activeProjectIndex === 0
    const isLastProject = activeProjectIndex === count
    const previousProject = !isFirstProject ? activeProjectIndex - 1 : activeProjectIndex
    const nextProject = !isLastProject ? activeProjectIndex + 1 : activeProjectIndex

    const goToPreviousProject = () => {
        console.log("PREV")
        navigate(projects[previousProject].node.fields.slug)
    }
    const goToNextProject = () => {
        navigate(projects[nextProject].node.fields.slug)
    }
  return (
    <div className="project-navigation is-flex is-flex-direction-row is-justify-content-space-between">
        <CrossButton onClick={() => goToPreviousProject()}>prev</CrossButton>

        <div className='project-navigation-numbers is-flex is-flex-direction-row'>
            {projects.map(({node}, index) => (
                <ProjectNumber project={node} currentProjectId={currentProjectId} index={index} key={node.id}></ProjectNumber>
            ))}
        </div> 

        <CrossButton onClick={() => goToNextProject()} >next</CrossButton>
    </div>
  )
}


// TODO: save this query in cache

const ProjectNavigation = (props) => {
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
                }
              }
            }
          }
        `}
        render={(data, count) => <ProjectNavigationTemplate {...props} projects={data.allMarkdownRemark.edges} count={count} />}
      />
    );
  }


export default ProjectNavigation