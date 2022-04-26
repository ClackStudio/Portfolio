import React from "react";
import PropTypes from "prop-types";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import Content, { HTMLContent } from "../components/Content";
import { TableLayout, TableRowComponent } from "../components/TableComponent";
import SectionTemplate from "../components/SectionTemplate";

// eslint-disable-next-line
export const ContactPageTemplate = ({ title, content, contentComponent, socialLinks, contactData }) => {
  const PageContent = contentComponent || Content;
  console.log(contactData)
  return (
    <SectionTemplate className="minus-navbar">
    <div className="columns fill-container minus-navbar">
      <div className="column fill-container minus-navbar">
        <div className="is-12 is-flex is-flex-direction-column is-justify-content-flex-end fill-container" >
          {/* <HalfPageNavbar /> */}
          {/* date */}
          <div className="column is-6 fill-container">
          <TableLayout>
          {contactData && contactData.map(({ title, data, }, index) => (
                  <TableRowComponent leftData={title} rightData={data} key={`key_add_data_${index}`} />

          ))}
          {socialLinks && socialLinks.map(({ title, name, url }, index) => (
                  <TableRowComponent leftData={title} rightData={<a href={url}>{name} </a>} key={`key_add_data_${index}`} />

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
  contentComponent: PropTypes.func,
};

const ContactPage = ({ data, location }) => {
  const { markdownRemark: post } = data;

  return (
    <Layout location={location}>
      <ContactPageTemplate
        contentComponent={HTMLContent}
        title={post.frontmatter.title}
        content={post.html}
        socialLinks={post.frontmatter.socialLinks}
        contactData={post.frontmatter.contactData}
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
