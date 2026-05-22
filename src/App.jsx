import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StockCard from "./StockCard";

function App() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [editingStock, setEditingStock] = useState(null);

  const loadData = async () => {
    // 1. 先顯示上次的快取資料
    const cachedData = localStorage.getItem("cachedStocks");
    if (cachedData) setStocks(JSON.parse(cachedData));

    setIsLoading(true);
    setStatusMessage("Loading");

    // 定義遞迴請求函數
    const attemptFetch = async () => {
      try {
        const res = await fetch("https://fund-app-backend-9wbm.onrender.com/api/funds");
        // const res = await fetch("http://localhost:8080/api/funds");
        if (!res.ok) throw new Error("Server not ready");
        
        const apiData = await res.json();
        
        const savedSettings = JSON.parse(localStorage.getItem("myStocks") || "{}");

        const processed = apiData.map((s) => {
          const id = s.name;
          const saved = savedSettings[id] || {shares: 1000 };
          return {
            ...s,
            id,
            price: s.nav_today,
            update_date: s.update_date,
            cost: saved.cost,
            shares: saved.shares,
            profitPercent: s.changePercent,
          };
        }).sort((a, b) => b.profitPercent - a.profitPercent);

        setStocks(processed);
        localStorage.setItem("cachedStocks", JSON.stringify(processed));

        setStatusMessage("更新成功");
        setTimeout(() => setIsLoading(false), 2000); // 顯示成功後 2 秒關閉

      } catch (e) {
        console.warn("後端尚未甦醒，3秒後重試...");
        // 失敗則 3 秒後再次執行 attemptFetch
        setTimeout(attemptFetch, 3000);
      }
    };

    // 啟動第一次請求
    attemptFetch();
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateStocksAndSave = (newList) => {
    setStocks(newList);
    const settingsToSave = newList.reduce((acc, s) => {
      acc[s.id] = { cost: s.cost, shares: s.shares };
      return acc;
    }, {});
    localStorage.setItem("myStocks", JSON.stringify(settingsToSave));
  };

  return (
    <div className="min-h-screen bg-[#1A1D23] text-white pt-16 p-4 scroll-container">
      {isLoading && (
        <div className="fixed top-11 left-6 z-50 text-gray-500 text-xs font-mono">
          {statusMessage === "Loading" ? (
            <span className="animate-dots"></span>
          ) : (
            <span className="text-green-500">Update successful  !!</span>
          )}
        </div>
      )}
      
      <div className="space-y-6">
        <AnimatePresence>
          {stocks.map((s, index) => (
            <StockCard
              key={s.id}
              index={index}
              stock={s}
              onClick={() => setEditingStock(s)}
              onDelete={() => {
                const newList = stocks.filter((x) => x.id !== s.id);
                updateStocksAndSave(newList);
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;