import { jsx } from "react/jsx-runtime";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const ScrollReveal = ({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
  once = true
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: "-80px" });
  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 60, y: 0 },
    right: { x: -60, y: 0 }
  };
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ref,
      className,
      initial: {
        opacity: 0,
        ...directionOffset[direction]
      },
      animate: isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, ...directionOffset[direction] },
      transition: {
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      },
      children
    }
  );
};
const StaggerContainer = ({
  children,
  className = "",
  staggerDelay = 0.1
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      ref,
      className,
      initial: "hidden",
      animate: isInView ? "visible" : "hidden",
      variants: {
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay
          }
        }
      },
      children
    }
  );
};
const StaggerItem = ({
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className,
      variants: {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.5,
            ease: [0.25, 0.1, 0.25, 1]
          }
        }
      },
      children
    }
  );
};
export {
  ScrollReveal,
  StaggerContainer,
  StaggerItem
};
