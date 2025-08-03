/**
 * TextAnimation Component
 *
 * @param {Object} props - Component properties
 * @param {string} props.text - The text to animate
 * @param {string|null} [props.linkHref=null] - Optional link URL
 * @param {string} [props.fontSize="1rem"] - Font size of the
 * @param {string} [props.color="#000"] - Text color
 */

import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import gsap from "gsap";
import SplitType from "split-type";

const TextAnimation = ({
  text,
  linkHref = null,
  fontSize = "1rem",
  color = "#231F20",
  animatedColor = "#66785E",
}) => {
  const wrapperRef = useRef(null);
  const charsRef = useRef({ text1: [], text2: [] });

  useEffect(() => {
    if (!wrapperRef.current) return;

    const text1 = wrapperRef.current.querySelector(".text-1");
    const text2 = wrapperRef.current.querySelector(".text-2");

    const split1 = new SplitType(text1, { types: "chars" });
    const split2 = new SplitType(text2, { types: "chars" });

    const chars1 = split1.chars;
    const chars2 = split2.chars;

    charsRef.current = { text1: chars1, text2: chars2 };

    gsap.set(chars1, { y: "0%" });
    gsap.set(chars2, { y: "100%" });

    return () => {
      split1.revert();
      split2.revert();
    };
  }, [text]);

  const handleMouseEnter = () => {
    const { text1, text2 } = charsRef.current;

    gsap.to(text1, {
      y: "-100%",
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(text2, {
      y: "0%",
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    const { text1, text2 } = charsRef.current;

    gsap.to(text1, {
      y: "0%",
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(text2, {
      y: "100%",
      stagger: 0.02,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const WrapperTag = linkHref ? "a" : "span";

  return (
    <Box
      component={WrapperTag}
      href={linkHref || undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={wrapperRef}
      sx={{
        textDecoration: "none",
        color,
        fontWeight: 500,
        fontSize,
        display: "inline-block",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-block" }}>
        <span className="text-1" style={{ display: "block" }}>
          {text}
        </span>
        <span
          className="text-2"
          style={{
            display: "block",
            position: "absolute",
            color: animatedColor,
            top: 0,
            left: 0,
          }}
        >
          {text}
        </span>
      </Box>
    </Box>
  );
};

export default TextAnimation;
