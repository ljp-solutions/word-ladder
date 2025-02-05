import { motion } from "framer-motion";
import { IconReplaceFilled } from "@tabler/icons-react";

const SwitchIcon = () => (
  <motion.div
    initial={{ y: -5, opacity: 0 }}
    animate={{ y: [0, -3, 3, -1.5, 1.5, 0], opacity: 1 }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
  >
    <IconReplaceFilled
      className="w-10 h-10 text-blue-400 
                transition-all duration-300 ease-in-out 
                hover:text-green-400 hover:rotate-12 hover:scale-110"
    />

  </motion.div>
);

export default SwitchIcon;
