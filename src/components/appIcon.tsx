import { motion } from "framer-motion";
import { IconSwitchHorizontal } from "@tabler/icons-react";

const SwitchIcon = () => (
  <motion.div
    initial={{ y: -5, opacity: 0 }}
    animate={{ y: [0, -3, 3, -1.5, 1.5, 0], opacity: 1 }}
    transition={{ duration: 1.2, ease: "easeInOut" }}
  >
    <IconSwitchHorizontal
      className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] 
                 hover:text-yellow-300 transition-all 
                 duration-200 ease-in-out hover:scale-110"
    />
  </motion.div>
);

export default SwitchIcon;
