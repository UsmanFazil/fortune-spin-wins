import React, { useState } from "react";
import { Button } from "@/components/ui/button";

// Crate data matching the reference image
const crateData = [
  {
    id: 1,
    name: "Basic Crate",
    price: 100,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    type: "basic",
    tag: "NEW"
  },
  {
    id: 2,
    name: "Pistol Crate",
    price: 100,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    type: "pistol"
  },
  {
    id: 3,
    name: "Consumable Crate",
    price: 60,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    type: "consumable"
  },
  {
    id: 4,
    name: "Consumable Crate",
    price: 60,
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&h=150&fit=crop",
    type: "consumable"
  },
  {
    id: 5,
    name: "Epic Crate",
    price: 500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop",
    type: "epic"
  },
  {
    id: 6,
    name: "Basic Crate",
    price: 500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop",
    type: "basic"
  },
  {
    id: 7,
    name: "Basic Crate",
    price: 500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop",
    type: "basic"
  },
  {
    id: 8,
    name: "Basic Crate",
    price: 500,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=200&h=150&fit=crop",
    type: "basic"
  }
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [userCurrency] = useState({
    silver: 163543,
    gold: 163543,
    premium: 163543
  });

  const tabs = ["ALL", "OFFERS", "LIMITED"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 via-slate-900 to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 via-transparent to-slate-900/30"></div>
      <div className="absolute inset-0" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.05) 0%, transparent 50%)
        `
      }}></div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-amber-200 tracking-wider uppercase">
            CRATES
          </h1>
          
          {/* Currency Display */}
          <div className="flex items-center gap-6">
            {/* Silver Currency */}
            <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-600/50">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                <span className="text-slate-800 font-bold text-sm">S</span>
              </div>
              <span className="text-white font-semibold">{userCurrency.silver.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors">
                +
              </button>
            </div>

            {/* Gold Currency */}
            <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-600/50">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <span className="text-yellow-900 font-bold text-sm">G</span>
              </div>
              <span className="text-white font-semibold">{userCurrency.gold.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors">
                +
              </button>
            </div>

            {/* Premium Currency */}
            <div className="flex items-center gap-2 bg-slate-800/60 rounded-lg px-4 py-2 border border-slate-600/50">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-purple-900 font-bold text-sm">P</span>
              </div>
              <span className="text-white font-semibold">{userCurrency.premium.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 font-semibold transition-all duration-300 ${
                activeTab === tab
                  ? "bg-amber-600 text-white border-b-2 border-amber-400"
                  : "bg-slate-700/50 text-gray-300 hover:bg-slate-600/50 hover:text-white"
              } ${tab === tabs[0] ? 'rounded-l-lg' : ''} ${tab === tabs[tabs.length - 1] ? 'rounded-r-lg' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Crates Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl">
          {crateData.map((crate) => (
            <div
              key={crate.id}
              className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-600/30 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/20"
            >
              {/* Tag for NEW items */}
              {crate.tag && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold z-10">
                  {crate.tag}
                </div>
              )}

              {/* Crate Content */}
              <div className="p-4 text-center">
                {/* Crate Name */}
                <h3 className="text-lg font-bold text-white mb-3">
                  {crate.name}
                </h3>

                {/* Crate Image */}
                <div className="relative mb-4 mx-auto w-32 h-24 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg shadow-2xl overflow-hidden">
                  <img 
                    src={crate.image} 
                    alt={crate.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex items-center gap-1 bg-slate-900/80 rounded-lg px-3 py-2 border border-amber-500">
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full flex items-center justify-center">
                      <span className="text-slate-800 font-bold text-xs">S</span>
                    </div>
                    <span className="text-amber-400 font-bold">{crate.price}</span>
                  </div>
                </div>

                {/* Purchase Button */}
                <Button 
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/25"
                >
                  Purchase
                </Button>
              </div>

              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Navigation Arrow */}
        <div className="fixed bottom-8 left-8">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
            <div className="text-2xl">‹‹</div>
          </button>
        </div>
      </div>
    </div>
  );
}