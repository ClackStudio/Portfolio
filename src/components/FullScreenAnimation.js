import React, { useEffect, useState } from "react";
import logo from "../img/clack-studio_logo.svg";
import { useTransitionStore } from "../stores/TransitionStore";
import { useSpring, animated } from "react-spring";

const FullScreenAnimation = ({ data }) => {
  const { setIntroAnimationDone } = useTransitionStore();

  const [animated1, setAnimated1] = useState(false);

  const startValues = {
    position: [0, 7, 1],
    args: [20, 1],
  };

  const endValues = {
    position: [0, -7, 1],
    args: [20, 6],
  };

  const [spring, springApi] = useSpring(() => ({
    from: { ...startValues },
    to: { ...endValues },
    onRest: () => setIntroAnimationDone(),
    config: { mass: 1, tension: 2, friction: 0, clamp: true },
    delay: 0,
  }));

  springApi.start();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setAnimated1(true);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [animated1]);

  return (
    <animated.div className={"intro-logo-wrapper"}>
      <div className={`intro-logo-wrapper ${animated1 ? "transparent" : ""}`}>
        <animated.img src={logo} className="intro-logo"></animated.img>
      </div>
    </animated.div>
  );
};

export default FullScreenAnimation;
