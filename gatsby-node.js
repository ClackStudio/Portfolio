const _ = require('lodash')
const path = require('path')
const { createFilePath } = require('gatsby-source-filesystem')
const { fmImagesToRelative } = require('gatsby-remark-relative-images')

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allMarkdownRemark(limit: 1000) {
        edges {
          node {
            id
            fields {
              slug
            }
            frontmatter {
              tags
              templateKey
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      result.errors.forEach((e) => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const posts = result.data.allMarkdownRemark.edges

    posts.forEach((edge) => {
      const id = edge.node.id
      createPage({
        path: edge.node.fields.slug,
        tags: edge.node.frontmatter.tags,
        component: path.resolve(
          `src/templates/${String(edge.node.frontmatter.templateKey)}.js`
        ),
        // additional data can be passed via context
        context: {
          id,
        },
      })
    })

    // Tag pages:
    let tags = []
    // Iterate through each post, putting all found tags into `tags`
    posts.forEach((edge) => {
      if (_.get(edge, `node.frontmatter.tags`)) {
        tags = tags.concat(edge.node.frontmatter.tags)
      }
    })
    // Eliminate duplicate tags
    tags = _.uniq(tags)

    // Make tag pages
    tags.forEach((tag) => {
      const tagPath = `/tags/${_.kebabCase(tag)}/`

      createPage({
        path: tagPath,
        component: path.resolve(`src/templates/tags.js`),
        context: {
          tag,
        },
      })
    })
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  fmImagesToRelative(node) // convert image paths for gatsby images

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the Markdown frontmatter object
  // This way those will always be defined as file even if CMS leaves a blank string
  // This way the queries will return `null` even when a blank string is left
  createTypes(`
    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
    }

    type Section {
      left: Boolean
      horizontal: Boolean
      altText: String
      altTextSecond: String
      centeredFirst: Boolean
      centeredFirstMobile: Boolean
      centeredSecond:Boolean
      centeredSecondMobile: Boolean
      src: File @fileByRelativePath
      secondImage: File @fileByRelativePath
      video: File @fileByRelativePath
    }

    type Frontmatter {
      featuredimage: File @fileByRelativePath
      featuredVideo: File @fileByRelativePath
      lastImage: File @fileByRelativePath
      title: String
      description: String
      client: String
      centeredFirstImage: Boolean
      centeredFirstImageMobile: Boolean
      centeredLastImage: Boolean
      centeredLastImageMobile: Boolean
      additionalData: [AdditionalData]
      section: [Section]
    }

    type AdditionalData {
      title: String
      data: String
    }
  `);
};