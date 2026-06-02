import React from "react";
import { motion } from "framer-motion";

const FloatingBackground = () => {
  const floatingItems = [
    { src: "/mimi.png", top: "10%", left: "5%", duration: 25 },
    { src: "/ote.png", top: "90%", left: "0%", duration: 35 },
    { src: "/oji.png", top: "20%", left: "80%", duration: 20 },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden z-1000 pointer-events-none opacity-50">
      {floatingItems.map((item, index) => (
        <motion.img
          key={index}
          src={item.src}
          className="w-15 h-15 object-contain absolute"
          style={{ top: item.top, left: item.left }}
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 100, 0],
            rotate: [0, 20, -20, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 2,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingBackground;