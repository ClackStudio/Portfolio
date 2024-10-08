import * as React from 'react'
import { Helmet } from 'react-helmet'
import { Link, graphql } from 'gatsby'
import Layout from '../components/Layout'

const TagRoute = ({ data, location, pageContext }) => {
  const posts = data.allMarkdownRemark.edges
  const postLinks = posts.map((post) => (
    <li key={post.node.fields.slug}>
      <Link to={post.node.fields.slug}>
        <div className="is-size-2">{post.node.frontmatter.title}</div>
      </Link>
    </li>
  ));
  const tag = pageContext.tag
  const title = data.site.siteMetadata.title
  const totalCount = data.allMarkdownRemark.totalCount
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? '' : 's'
  } tagged with “${tag}”`

  return (
    <Layout location={location}>
      <section className="section">
        <Helmet title={`${tag} | ${title}`} />
        <div className="container content">
          <div className="columns">
            <div
              className="column is-10 is-offset-1"
              style={{ marginBottom: "6rem" }}
            >
              <span className="title is-size-4 is-bold-light">{tagHeader}</span>
              <ul className="taglist">{postLinks}</ul>
              <p>
                <Link to="/tags/">Browse all tags</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default TagRoute

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`
