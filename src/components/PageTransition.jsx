import { jsx } from "react/jsx-runtime";
import { motion } from "framer-motion";
const pageVariants = {
  initial: {
    opacity: 0,
    y: 12
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};
const PageTransition = ({ children }) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      variants: pageVariants,
      initial: "initial",
      animate: "animate",
      exit: "exit",
      children
    }
  );
};
export {
  PageTransition
};
