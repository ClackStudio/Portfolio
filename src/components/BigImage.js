import React from "react";
import PropTypes from "prop-types";
import { GatsbyImage } from "gatsby-plugin-image";

export default function BigImage(props) {
  const {
    height = "100%",
    img,
    imgPosition = "center",
    altText = ""
  } = props;


  return (
    <React.Fragment>
      <div
        className="margin-top-0"
        style={{
          minWidth: "100%",
          minHeight: "100%",
          height: "100%",
          display: "grid",
          alignItems: "center",
        }}
      >
        {img?.url ? (
          <img
            src={img}
            objectFit={"cover"}
            objectPosition={imgPosition}
            style={{
              gridArea: "1/1",
              // You can set a maximum height for the image, if you wish.
              height: height,

              width: "100%",
            }}
            // You can optionally force an aspect ratio for the generated image
            aspectratio={3 / 1}
            // This is a presentational image, so the alt should be an empty string
            alt={altText}
            formats={["auto", "webp", "avif"]}
          />
        ) : (
          <GatsbyImage
            image={img}
            objectFit={"cover"}
            objectPosition={imgPosition}
            style={{
              gridArea: "1/1",
              // You can set a maximum height for the image, if you wish.
              height: "100%",
              maxHeight: height,
            }}
            layout="fullWidth"
            // You can optionally force an aspect ratio for the generated image
            aspectratio={3 / 1}
            // This is a presentational image, so the alt should be an empty string
            alt={altText ? altText : ''}
            formats={["auto", "webp", "avif"]}
          />
        )}
      </div>
    </React.Fragment>
  );
}

BigImage.propTypes = {
  img: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  height: PropTypes.number,
  altText: PropTypes.string,
};
