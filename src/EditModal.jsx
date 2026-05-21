import { motion } from "framer-motion";
import { X, Check } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function EditModal({ stock, onClose, onSave }) {
  const [data, setData] = useState({ 
    shares: stock.shares || "", 
    cost: stock.cost || "" 
  });

  // 讓手機點開時自動 Focus 第一個欄位
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    onSave({
      shares: Number(data.shares),
      cost: Number(data.cost)
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/70 backdrop-blur-md" 
        onClick={onClose} 
      />

      <motion.div 
        initial={{ y: "100%" }} 
        animate={{ y: 0 }} 
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#1C1C1E] rounded-t-[32px] p-6 pb-12 border-t border-white/10 shadow-2xl"
      >
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />

        <div className="flex justify-between items-center mb-8">
          <button onClick={onClose} className="p-2 active:scale-90 transition-transform">
            <X size={24} className="text-gray-400" />
          </button>
          <h2 className="text-lg font-bold text-white tracking-tight">{stock.name}</h2>
          <button 
            onClick={handleSave} 
            className="p-2 bg-blue-500 rounded-full text-white shadow-lg shadow-blue-500/20 active:scale-90 transition-transform"
          >
            <Check size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* 持股數量 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-wider">持股數量 (股)</label>
            <input 
              ref={inputRef}
              className="w-full bg-[#2C2C2E] p-4 rounded-2xl text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 transition-all" 
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              value={data.shares} 
              placeholder="0"
              onChange={e => setData({...data, shares: e.target.value})} 
            />
          </div>

          {/* 買入成本 */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-1 tracking-wider">買入成本</label>
            <input 
              className="w-full bg-[#2C2C2E] p-4 rounded-2xl text-white font-bold text-lg outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 transition-all" 
              type="number" 
              inputMode="decimal"
              step="0.01" 
              value={data.cost} 
              placeholder="0.00"
              enterKeyHint="done"
              onChange={e => setData({...data, cost: e.target.value})} 
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}