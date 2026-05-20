import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StockCard from "./StockCard";
import EditModal from "./EditModal";

function App() {
  const [stocks, setStocks] = useState([]);
  const [editingStock, setEditingStock] = useState(null);

  const loadData = async () => {
    try {
      const res = await fetch("api/funds");
      const apiData = await res.json();
      
      // 讀取 LocalStorage 中的個人設定 (成本與股數)
      const savedSettings = JSON.parse(localStorage.getItem("myStocks") || "{}");

      const processed = apiData
        .map((s, index) => {
          const id = `${s.name}-${index}`;
          // 如果有儲存過的紀錄，就用紀錄的；沒有則用預設值
          const saved = savedSettings[id] || { cost: s.nav * 0.9, shares: 1000 };
          
          return {
            ...s,
            id,
            price: s.nav,
            cost: saved.cost,
            shares: saved.shares,
            profitPercent: ((s.nav - saved.cost) / saved.cost) * 100,
          };
        })
        .sort((a, b) => b.profitPercent - a.profitPercent);

      setStocks(processed);
    } catch (e) {
      console.error("API 獲取錯誤:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // 當 stocks 因編輯而變更時，同時更新 LocalStorage
  const updateStocksAndSave = (newList) => {
    setStocks(newList);
    // 將所有股票的個人設定轉為物件格式儲存
    const settingsToSave = newList.reduce((acc, s) => {
      acc[s.id] = { cost: s.cost, shares: s.shares };
      return acc;
    }, {});
    localStorage.setItem("myStocks", JSON.stringify(settingsToSave));
  };

  return (
    <div className="min-h-screen bg-black text-white pt-15 p-4">
      <div className="space-y-6">
        <AnimatePresence>
          {stocks.map((s) => (
            <StockCard
              key={s.id}
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

      {editingStock && (
        <EditModal
          stock={editingStock}
          onClose={() => setEditingStock(null)}
          onSave={(newData) => {
            const newList = stocks
              .map((x) =>
                x.id === editingStock.id
                  ? {
                      ...x,
                      ...newData,
                      profitPercent: ((x.price - newData.cost) / newData.cost) * 100,
                    }
                  : x
              )
              .sort((a, b) => b.profitPercent - a.profitPercent);
            
            updateStocksAndSave(newList);
            setEditingStock(null);
          }}
        />
      )}
    </div>
  );
}

export default App;