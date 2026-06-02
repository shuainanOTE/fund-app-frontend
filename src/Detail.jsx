import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, PieChart } from "lucide-react";
import FloatingBackground from "./FloatingBackground";

export default function Detail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const stock = state?.stock;

  if (!stock) {
    navigate("/");
    return null;
  }

  const containerVars = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <div className="min-h-screen bg-[#1A1D23] text-gray-100 p-5 pb-12 overflow-y-auto font-sans">
        <FloatingBackground />
      {/* 頂部導覽列 */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(-1)}
        className="flex items-center text-white/60 hover:text-white mb-6 gap-2 font-medium active:scale-95 transition-all"
      >
        <ArrowLeft size={22} />
        <span className="text-sm tracking-wide">返回列表</span>
      </motion.button>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* 1. 基金主視覺卡片 */}
        <motion.div
          variants={itemVars}
          className="relative overflow-hidden rounded-[2rem] p-8 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-cyan-200 via-blue-300 to-purple-300 mb-2 leading-tight">
                {stock.name}
              </h1>
              <p className="text-white/40 text-xs font-mono tracking-wider">
                {stock.date} 更新
              </p>
            </div>

            <div className="flex flex-col items-end gap-1">
              <p className="text-3xl font-black text-white tracking-tighter drop-shadow-lg">
                {(stock.nav || 0).toFixed(2)}
              </p>
              <div className="flex flex-col items-end">
                <span
                  className={`text-sm font-bold ${stock.changePercent >= 0 ? "text-pink-400" : "text-emerald-400"}`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent?.toFixed(2)}%
                </span>
                <span className="text-[10px] text-white/30 font-mono">
                  昨:{" "}
                  {(stock.nav / (1 + (stock.changePercent || 0) / 100)).toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 2. 績效表現區塊 */}
        <motion.div
          variants={itemVars}
          className="rounded-[2rem] p-6 bg-white/[0.02] border border-white/[0.05]"
        >
          <div className="flex items-center gap-2 mb-5 text-white/80">
            <TrendingUp size={20} className="text-cyan-400" />
            <h2 className="font-bold tracking-wide">績效表現</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {stock.performance?.map((p, i) => {
              const rateVal = Number(p.rate || 0);
              const isPos = rateVal >= 0;
              return (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center bg-white/[0.03] p-3 rounded-2xl border border-white/[0.02] hover:bg-white/[0.06] transition-colors"
                >
                  <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-1">
                    {p.period}
                  </span>
                  <span
                    className={`text-base font-bold ${isPos ? "text-pink-400" : "text-emerald-400"}`}
                  >
                    {isPos ? "+" : ""}
                    {rateVal.toFixed(2)}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* 3. 投資明細區塊 */}
        {stock.holdings && stock.holdings.length > 0 && (
          <motion.div
            variants={itemVars}
            className="rounded-[2rem] p-6 bg-white/[0.02] border border-white/[0.05]"
          >
            <div className="flex items-center gap-2 mb-2 text-white/80">
              <PieChart size={20} className="text-purple-400" />
              <h2 className="font-bold tracking-wide">投資明細</h2>
            </div>

            <div className="mt-4">
              {stock.holdings.map((h, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-3.5 border-b border-white/[0.04] last:border-0 group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {h.stock}
                  </span>
                  <span className="font-mono text-sm font-bold text-purple-300 bg-purple-500/10 px-2 py-1 rounded-lg">
                    {h.percent}%
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
