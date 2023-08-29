import React from "react";
import ReactPlayer from "react-player";
import { useBreakpoint } from "gatsby-plugin-breakpoints";

const VideoIFrame = ({ url = "https://vimeo.com/404559285" }) => {
  const breakpoints = useBreakpoint();
  const isMobile = breakpoints.sm;

  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        autoplay
        playsinline
        loop
        muted
        width="100%"
        height="100%"
        playing
        config={{
          vimeo: {
            playerOptions: {
              responsive: isMobile || false,
            },
          },
        }}
        url={url}
      />
    </div>
  );
};

export default VideoIFrame;
