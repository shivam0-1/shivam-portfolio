import { motion, useReducedMotion } from "framer-motion";

// Fade + rise when scrolled into view. MotionConfig in App handles reduced motion.
const Reveal = ({ children, delay = 0, y = 24, as = "div", className = "" }) => {
  const Tag = motion[as];
  const reduced = useReducedMotion();
  return (
    <Tag
      className={className}
      initial={reduced ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: reduced ? 0 : 0.8, delay: reduced ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </Tag>
  );
};

export default Reveal;
