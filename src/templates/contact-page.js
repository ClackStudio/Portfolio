import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import { TableLayout, TableRowComponent } from "../components/TableComponent";
import SectionTemplate from "../components/SectionTemplate";
import Seo from "../components/Seo";

// eslint-disable-next-line
export const ContactPageTemplate = ({
  title,
  description,
  content,
  contentComponent,
  socialLinks,
  contactData,
  blockSearch,
}) => {
  // const PageContent = contentComponent || Content;
  return (
    <SectionTemplate className="single-page-wrapper">
      <Seo
        title={title}
        description={description}
        blockSearch={blockSearch}
      ></Seo>
      <div className="columns fill-container">
        <div className="column fill-container fill-complete-height">
          <div className="is-12 is-flex is-flex-direction-column is-justify-content-flex-end fill-container bigger-font">
            <div className="column is-flex is-12 fill-container extra-top-padding">
              <TableLayout className="limit-width">
                {contactData &&
                  contactData.map(({ title, data }, index) => (
                    <TableRowComponent
                      leftData={title}
                      rightData={data}
                      key={`key_add_data_${index}`}
                      noCrossLine
                    />
                  ))}
                {socialLinks &&
                  socialLinks.map(({ title, name, url }, index) => (
                    <TableRowComponent
                      leftData={title}
                      rightData={<a href={url}>{name} </a>}
                      key={`key_add_data_${index}`}
                      noCrossLine
                    />
                  ))}
              </TableLayout>
            </div>
          </div>
        </div>
        {/* <PostContent content={content} /> */}
      </div>
      <div className="column is-6 fill-container">
        {/* <BigImage counter={counter.current} img={sideImage} ></BigImage> */}
      </div>
    </SectionTemplate>
  );
};

ContactPageTemplate.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string,
  description: PropTypes.string,
  contentComponent: PropTypes.func,
  blockSearch: PropTypes.bool,
};

const ContactPage = ({ data, location }) => {
  const { markdownRemark: post } = data;
  return (
    <Layout location={location}>
      <ContactPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        description={post.frontmatter.description}
        content={post.html}
        socialLinks={post.frontmatter.socialLinks}
        contactData={post.frontmatter.contactData}
        blockSearch={post.frontmatter.blockSearch}
      />
    </Layout>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired,
};

export default ContactPage;

export const contactPageQuery = graphql`
  query ContactPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        title
        description
        blockSearch
        contactData {
          title
          data
        }
        socialLinks {
          title
          name
          url
        }
      }
    }
  }
`;
