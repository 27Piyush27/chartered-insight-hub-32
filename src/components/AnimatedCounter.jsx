import { jsxs } from "react/jsx-runtime";
import { useInView, useMotionValue, useSpring, motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
const AnimatedCounter = ({
  target,
  suffix = "",
  duration = 2,
  className = ""
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, {
    duration: duration * 1e3,
    bounce: 0
  });
  useEffect(() => {
    if (isInView) {
      motionValue.set(target);
    }
  }, [isInView, target, motionValue]);
  useEffect(() => {
    const unsubscribe = spring.on("change", (v) => {
      setDisplay(Math.round(v).toString());
    });
    return unsubscribe;
  }, [spring]);
  return /* @__PURE__ */ jsxs(
    motion.span,
    {
      ref,
      className,
      initial: { opacity: 0, y: 20 },
      animate: isInView ? { opacity: 1, y: 0 } : {},
      transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
      children: [
        display,
        suffix
      ]
    }
  );
};
export {
  AnimatedCounter
};
