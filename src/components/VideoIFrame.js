import React from "react";
import { Link } from "gatsby";
import ReactPlayer from "react-player";

const VideoIFrame = ({ url = "https://vimeo.com/404559285" }) => {
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
        url={url}
      />
    </div>
  );
};

export default VideoIFrame;
