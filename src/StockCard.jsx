import { motion, useAnimation } from "framer-motion";
import { Trash2, Triangle } from "lucide-react";

export default function StockCard({ stock, onClick, onDelete }) {
  const controls = useAnimation();
  const isPos = stock.profitPercent >= 0;
  const handleDragEnd = (event, info) => {
    if (info.offset.x < -40) {
      controls.start({ x: -80 });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[24px] bg-[#FF3B30] mb-5">
      {/* 底部刪除按鈕 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-white active:bg-black/20 transition-colors"
      >
        <Trash2 size={24} />
      </button>

      {/* 卡片 */}
      <motion.div
        drag="x"
        animate={controls}
        whileTap={{ backgroundColor: "#2C2C2E" }}
        transition={{ duration: 0.1 }}
        dragConstraints={{ left: -80, right: 0 }}
        dragElastic={{ left: 0.1, right: 0 }}
        onDragEnd={handleDragEnd}
        className="relative z-10 bg-[#1C1C1E] p-6 flex justify-between items-center touch-pan-y"
        onClick={() => {
          controls.start({ x: 0 });
          onClick();
        }}
      >
        {/* 左側：名稱與詳細資訊 */}
        <div className="flex flex-col gap-1">
          <div className="font-bold text-[18px] text-white">{stock.name}</div>
          <div className="flex items-center gap-2 text-gray-300 text-xs font-black">
            {/* <span>{stock.shares} 股</span> */}
          </div>
            <span className="text-blue-200 text-xs"> 
              {stock.update_date
                ? stock.update_date
                    .split("-")
                    .slice(1)
                    .map((s) => parseInt(s))
                    .join("/")
                : "無日期"} 更新
            </span>
        </div>

        {/* 右側：價格與漲幅 */}
        <div className="flex flex-col items-end">
          <p className="text-[16px] font-bold text-white mb-1 px-2">
            {stock.price.toFixed(2)}
          </p>
          <div
            className={`flex items-center justify-center px-2 py-1.5 rounded-4xl min-w-[10px] font-bold text-[14px] ${
              isPos
                ? "bg-[#FF3B30]/10 text-[#FF3B30]"
                : "bg-[#34C759]/10 text-[#34C759]"
            }`}
          >
            <Triangle
              size={10}
              fill={isPos ? "#FF3B30" : "#34C759"}
              className={`mr-1 transition-transform ${isPos ? "" : "rotate-180"}`}
            />
            {Math.abs(stock.profitPercent).toFixed(2)}%
          </div>
        </div>
      </motion.div>
    </div>
  );
}
