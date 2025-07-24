import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import woodenCrate from "@/assets/crates/wooden-crate.png";
import metalCrate from "@/assets/crates/metal-crate.png";

const crateData = [
  {
    id: 1,
    name: "Basic Crate",
    price: 100,
    image: woodenCrate,
    type: "basic",
    tag: "NEW"
  },
  {
    id: 2,
    name: "Pistol Crate",
    price: 100,
    image: woodenCrate,
    type: "pistol"
  },
  {
    id: 3,
    name: "Consumable Crate",
    price: 100,
    image: woodenCrate,
    type: "consumable"
  },
  {
    id: 4,
    name: "Consumable Crate",
    price: 100,
    image: woodenCrate,
    type: "consumable"
  },
  {
    id: 5,
    name: "Epic Crate",
    price: 500,
    image: metalCrate,
    type: "epic"
  },
  {
    id: 6,
    name: "Basic Crate",
    price: 500,
    image: metalCrate,
    type: "basic"
  },
  {
    id: 7,
    name: "Basic Crate",
    price: 500,
    image: metalCrate,
    type: "basic"
  },
  {
    id: 8,
    name: "Basic Crate",
    price: 500,
    image: metalCrate,
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Military/Tactical Background */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23333333' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-6xl font-bold text-white tracking-wider uppercase font-mono">
            CRATES
          </h1>
          
          {/* Currency Display */}
          <div className="flex items-center gap-4">
            {/* Silver Currency */}
            <div className="flex items-center gap-3 bg-black/80 rounded-lg px-5 py-3 border border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-300 to-gray-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-gray-800 rounded-full"></div>
              </div>
              <span className="text-white font-bold text-lg">{userCurrency.silver.toLocaleString()}</span>
              <button className="w-7 h-7 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>

            {/* Gold Currency */}
            <div className="flex items-center gap-3 bg-black/80 rounded-lg px-5 py-3 border border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-yellow-800 rounded-full"></div>
              </div>
              <span className="text-white font-bold text-lg">{userCurrency.gold.toLocaleString()}</span>
              <button className="w-7 h-7 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>

            {/* Premium Currency */}
            <div className="flex items-center gap-3 bg-black/80 rounded-lg px-5 py-3 border border-gray-600">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-800 rounded-full"></div>
              </div>
              <span className="text-white font-bold text-lg">{userCurrency.premium.toLocaleString()}</span>
              <button className="w-7 h-7 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-12">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-4 font-bold text-lg transition-all duration-300 border-2 ${
                activeTab === tab
                  ? "bg-transparent text-white border-white"
                  : "bg-transparent text-gray-400 border-gray-600 hover:border-gray-400 hover:text-white"
              } ${index === 0 ? 'rounded-l-lg' : ''} ${index === tabs.length - 1 ? 'rounded-r-lg' : ''}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Crates Grid */}
        <div className="grid grid-cols-4 gap-8 max-w-7xl">
          {crateData.map((crate) => (
            <div
              key={crate.id}
              className="group relative bg-black/40 rounded-lg border border-gray-700 overflow-hidden transition-all duration-300 hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/20 backdrop-blur-sm"
            >
              {/* Tag for NEW items */}
              {crate.tag && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold z-20">
                  {crate.tag}
                </div>
              )}

              {/* Crate Content */}
              <div className="p-6 text-left">
                {/* Crate Name */}
                <h3 className="text-xl font-bold text-white mb-6">
                  {crate.name}
                </h3>

                {/* Crate Image */}
                <div className="relative mb-6 h-32 flex items-center justify-center">
                  <img 
                    src={crate.image} 
                    alt={crate.name}
                    className="h-full w-auto object-contain filter drop-shadow-lg"
                  />
                </div>

                {/* Price */}
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center gap-2 bg-yellow-600 rounded px-3 py-2 border-2 border-yellow-500">
                    <div className="w-5 h-5 bg-gradient-to-br from-gray-300 to-gray-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                    <span className="text-black font-bold text-lg">{crate.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrow */}
        <div className="fixed bottom-8 left-8">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/50 rounded-lg px-4 py-2 border border-gray-600">
            <div className="text-3xl font-bold">‹‹</div>
          </button>
        </div>
      </div>
    </div>
  );
}