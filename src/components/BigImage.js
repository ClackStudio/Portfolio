import React from "react";
import PropTypes from "prop-types";
import { GatsbyImage } from "gatsby-plugin-image";

export default function BigImage(props) {
  const {
    height = "100%",
    img,
    imgPosition = "center",
    altText = "",
    className = "",
    objectFit = "cover",
    flexImage = false,
  } = props;

  const flexImageStyles = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
  };
  return (
    <React.Fragment>
      <div
        className={`margin-top-0 ${className}`}
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
            objectFit={objectFit}
            objectPosition={imgPosition}
            style={{
              gridArea: "1/1",
              // You can set a maximum height for the image, if you wish.
              height: height,
              width: "100%",
              ...(flexImage ? flexImageStyles : {}),
            }}
            // You can optionally force an aspect ratio for the generated image
            // aspectratio={3 / 1}
            // This is a presentational image, so the alt should be an empty string
            alt={altText}
            formats={["auto", "webp", "avif"]}
          />
        ) : (
          <GatsbyImage
            image={img}
            objectFit={objectFit}
            objectPosition={imgPosition}
            style={{
              gridArea: "1/1",
              // You can set a maximum height for the image, if you wish.
              height: "100%",
              width: "100%",
              maxHeight: height,
              ...(flexImage ? flexImageStyles : {}),
            }}
            layout="fullWidth"
            // You can optionally force an aspect ratio for the generated image
            // aspectratio={3 / 1}
            // This is a presentational image, so the alt should be an empty string
            alt={altText ? altText : ""}
            formats={["auto", "webp", "avif"]}
          />
        )}
      </div>
    </React.Fragment>
  );
}

BigImage.propTypes = {
  objectFit: PropTypes.string,
  img: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  height: PropTypes.number,
  altText: PropTypes.string,
};
