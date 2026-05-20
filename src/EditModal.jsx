import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useState } from "react";

export default function EditModal({ stock, onClose, onSave }) {
  const [data, setData] = useState({ 
    shares: stock.shares || "", 
    cost: stock.cost || "" 
  });

  const handleSave = () => {
    onSave({
      shares: Number(data.shares),
      cost: Number(data.cost)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* 背景遮罩 */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose} 
      />

      {/* 彈窗本體 */}
      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-full bg-[#1C1C1E] rounded-t-[32px] p-6 pb-12 border-t border-white/10"
      >
        {/* iOS 抓手 */}
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-gray-400">
            <X size={20} />
          </button>
          <div className="text-center">
            <h2 className="text-lg font-bold text-white">{stock.name}</h2>
          </div>
          <button onClick={handleSave} className="p-2 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/20">
            <Check size={20} />
          </button>
        </div>

        {/* 輸入欄位區域 */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">持股數量 (股)</label>
            <input 
              className="w-full bg-[#2C2C2E] p-4 rounded-2xl text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" 
              type="number" 
              value={data.shares} 
              placeholder="輸入股數"
              onChange={e => setData({...data, shares: e.target.value})} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1">買入成本</label>
            <input 
              className="w-full bg-[#2C2C2E] p-4 rounded-2xl text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500" 
              type="number" 
              step="0.01" 
              value={data.cost} 
              placeholder="輸入平均成本"
              onChange={e => setData({...data, cost: e.target.value})} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}