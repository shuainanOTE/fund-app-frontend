import { motion, useAnimation } from "framer-motion";
import { Trash2, Triangle } from "lucide-react";

// 注意：這裡新增了 index 參數
export default function StockCard({ stock, index, onClick, onDelete }) {
  const controls = useAnimation();
  const isPos = stock.profitPercent >= 0;

  const handleDragEnd = (event, info) => {
    // 如果滑動超過一定距離 (-40)，固定在 -80 的位置顯示刪除按鈕
    if (info.offset.x < -40) {
      controls.start({ x: -80 });
    } else {
      // 否則彈回原位
      controls.start({ x: 0 });
    }
  };

  // 莫蘭迪質感配色方案 (女生喜歡的色調)
  const colors = [
    "bg-[#EADBC8]", // 奶茶色
    "bg-[#F2D7D9]", // 乾燥玫瑰粉
    "bg-[#D1E0E8]", // 霧霾藍
    "bg-[#F7F3E9]", // 奶油白
    "bg-[#E6E6FA]", // 薰衣草紫
  ];

  // 根據 index 循環選色
  const bgColor = colors[index % 5];

  return (
    // 關鍵修改 1：底部層級：將紅色 bg-[#FF3B30] 改為穩重的深灰色或柔和背景色，與淺色卡片做出質感對比
    <div
      className={`relative overflow-hidden rounded-[24px] mb-5 bg-[#333333] shadow-lg shadow-black/10`}
    >
      {/* 底部刪除按鈕區域 - 這個區域被固定在下方 */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // 阻止觸發卡片的 onClick
          onDelete();
        }}
        // 關鍵修改 2：調整垃圾桶顏色為 text-gray-400，並設置一個輕盈的 active 背景
        className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center text-gray-400 active:bg-black/10 transition-colors"
      >
        <Trash2 size={24} />
      </button>

      {/* 卡片本體：底色變更為莫蘭迪色，文字改為深色系 */}
      <motion.div
        drag="x" // 僅允許水平滑動
        animate={controls}
        whileTap={{ opacity: 0.9 }} // 點擊時輕微透明
        transition={{ type: "spring", stiffness: 300, damping: 30 }} // 使用彈簧動畫，更有手感
        dragConstraints={{ left: -80, right: 0 }} // 限制滑動範圍
        dragElastic={{ left: 0.1, right: 0 }} // 右側不具備彈性，左側有輕微彈性
        onDragEnd={handleDragEnd}
        className={`relative z-10 p-6 flex justify-between items-center touch-pan-y ${bgColor} backdrop-blur-md
        border border-white/60 
        shadow-[0_8px_32px_0_rgba(0,0,0,0.1)]`}
        onClick={() => {
          // 點擊卡片時，先讓卡片彈回原位，再執行核心 onClick 邏輯
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
            {stock.updateDate
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
          {/* 涨跌幅保持原色，但在柔和背景下更顯眼 */}
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
