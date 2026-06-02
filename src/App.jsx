import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCw } from "lucide-react";
import StockCard from "./StockCard";
import FloatingBackground from "./FloatingBackground";

// const API_BASE_URL = "http://localhost:8080/api";
const API_BASE_URL = "https://fund-app-backend-9wbm.onrender.com/api";

function App() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const navigate = useNavigate();

  const processAndSetData = (apiData) => {
    const savedSettings = JSON.parse(localStorage.getItem("myStocks") || "{}");

    const processed = apiData
      .map((s) => {
        const id = s.name;
        const saved = savedSettings[id] || { shares: 1000 };
        return {
          ...s,
          id,
          cost: saved.cost,
          shares: saved.shares,
          profitPercent: s.changePercent,
        };
      })
      .sort((a, b) => b.profitPercent - a.profitPercent);

    setStocks(processed);
    localStorage.setItem("cachedStocks", JSON.stringify(processed));
  };

  const loadData = async () => {
    const cachedData = localStorage.getItem("cachedStocks");
    if (cachedData) setStocks(JSON.parse(cachedData));

    setIsLoading(true);
    setStatusMessage("Loading");

    const attemptFetch = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/fetch/all`);
        if (!res.ok) throw new Error("Server not ready");

        const apiData = await res.json();
        processAndSetData(apiData);

        setStatusMessage("更新成功");
        setTimeout(() => setIsLoading(false), 2000);
      } catch (e) {
        console.warn("後端尚未甦醒，3秒後重試...");
        setTimeout(attemptFetch, 3000);
      }
    };
    attemptFetch();
  };

  const handleManualUpdate = async () => {
    setIsSpinning(true);
    setStatusMessage("Loading");
    setIsLoading(true);

    try {
      await Promise.all([
        fetch(`${API_BASE_URL}/update/fund`),
        fetch(`${API_BASE_URL}/update/holding`),
        fetch(`${API_BASE_URL}/update/performance`),
      ]);

      const fundsRes = await fetch(`${API_BASE_URL}/fetch/all`);
      if (!fundsRes.ok) throw new Error("Fetch funds failed");

      const newData = await fundsRes.json();
      processAndSetData(newData);

      setStatusMessage("Update successful");
    } catch (e) {
      console.error("更新過程中發生錯誤:", e);
      setStatusMessage("Update failed");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsSpinning(false);
      }, 1000);
      setTimeout(() => setStatusMessage(""), 2000);
    }
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
      <FloatingBackground />
      {isLoading && (
        <div className="fixed top-11 left-6 z-50 text-gray-500 text-xs font-mono">
          {statusMessage === "Loading" ? (
            <span className="animate-dots"></span>
          ) : (
            <span className="text-green-500">Update successful !!</span>
          )}
        </div>
      )}

      <motion.button
        onClick={handleManualUpdate}
        disabled={isSpinning}
        whileTap={{ scale: 0.8 }}
        animate={{ rotate: isSpinning ? 360 : 0 }}
        transition={
          isSpinning
            ? { duration: 1, repeat: Infinity, ease: "linear" }
            : { duration: 0.2, ease: "easeOut" }
        }
        className="fixed top-9 right-6 z-50 p-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
        title="手動更新資料"
      >
        <RefreshCw size={16} />
      </motion.button>

      <div className="space-y-6">
        <AnimatePresence>
          {stocks.map((s, index) => (
            <StockCard
              key={s.id}
              index={index}
              stock={s}
              onClick={() => {
                navigate(`/detail/${s.id}`, { state: { stock: s } });
              }}
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
