import type { Transition, Variants } from "framer-motion";

export const smoothSpring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 24
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08
    }
  }
};

export const drawerMotion = {
  initial: { x: "100%" },
  animate: { x: 0 },
  exit: { x: "100%" },
  transition: smoothSpring
};

export const leftDrawerMotion = {
  initial: { x: "-100%" },
  animate: { x: 0 },
  exit: { x: "-100%" },
  transition: smoothSpring
};
