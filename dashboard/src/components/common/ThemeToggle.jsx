import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "@/redux/slices/themeSlice";
import { selectTheme } from "@/redux/slices/themeSlice";
import { CiDark, CiLight } from "react-icons/ci";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  return (
    <motion.button
      onClick={() => dispatch(toggleTheme())}
      className="button !p-0 size-10 3xl:size-12 bg-light-surface2 dark:bg-dark-highlight rounded-full flex justify-center items-center"
      whileTap={{ scale: 0.9 }}
      animate={{
        rotate: theme === "dark" ? 180 : 0,
        scale: 1,
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
      }}
    >
      {theme === "dark" ? (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <CiDark className="text-textcolor text-lg 2xl:text-xl 3xl:text-2xl" />
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
          <CiLight className="text-textcolor text-lg 2xl:text-xl 3xl:text-2xl" />
        </motion.div>
      )}
    </motion.button>
  );
};
