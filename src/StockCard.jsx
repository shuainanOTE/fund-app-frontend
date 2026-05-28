import { motion, useAnimation } from "framer-motion";
import { Trash2, Triangle } from "lucide-react";

export default function StockCard({ stock, index, onClick, onDelete }) {
  const controls = useAnimation();
  const isPos = stock.profitPercent >= 0;

  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      controls.start({ x: -80 });
    } else {
      controls.start({ x: 0 });
    }
  };

  const colors = [
    "bg-[#EADBC8]", // 奶茶色
    "bg-[#F2D7D9]", // 乾燥玫瑰粉
    "bg-[#D1E0E8]", // 霧霾藍
    "bg-[#F7F3E9]", // 奶油白
    "bg-[#E6E6FA]", // 薰衣草紫
  ];

  const bgColor = colors[index % 5];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl mb-5 bg-[#333333] shadow-lg shadow-black/10`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-gray-400 active:bg-black/10 transition-colors"
      >
        <Trash2 size={24} />
      </button>

      {/* 卡片本體 */}
      <motion.div
        drag="x"
        animate={controls}
        whileTap={{ opacity: 0.9 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        onDragEnd={handleDragEnd}
        className={`relative z-10 p-6 flex justify-between items-center touch-pan-y ${bgColor} backdrop-blur-md
        border border-white/60 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]`}
        onClick={() => {
          controls.start({ x: 0 });
          onClick();
        }}
      >
        {/* 左側資訊 */}
        <div className="flex flex-col gap-1">
          <div className="font-bold text-[18px] text-[#434040]">
            {stock.name}
          </div>
          <span className="text-[#0505058b] text-xs font-medium">
            {stock.date
              ?.split("-")
              .slice(1)
              .map((s) => parseInt(s))
              .join("/")}{" "}
            更新
          </span>
        </div>

        {/* 右側資訊 */}
        <div className="flex flex-col items-end">
          <p className="text-[16px] font-bold text-[#333] mb-1 px-2">
            {(stock.nav || 0).toFixed(2)}
          </p>
          <div
            className={`flex items-center px-3 py-1 rounded-full font-bold text-[13px] ${
              isPos
                ? "bg-red-500/10 text-red-600"
                : "bg-green-600/10 text-green-700"
            }`}
          >
            <Triangle
              size={10}
              fill={isPos ? "#dc2626" : "#15803d"}
              className={`mr-1 ${isPos ? "" : "rotate-180"}`}
            />
            {Math.abs(stock.profitPercent || 0).toFixed(2)}%
          </div>
        </div>
      </motion.div>
    </div>
  );
}
