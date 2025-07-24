import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

// Import crate images
import woodenCrate from "@/assets/crates/wooden-crate.png";
import metalCrate from "@/assets/crates/metal-crate.png";

const crateData = [
  {
    id: 1,
    name: "Basic Crate",
    price: "100",
    image: woodenCrate,
    type: "ALL",
    tag: "NEW"
  },
  {
    id: 2,
    name: "Pistol Crate",
    price: "100", 
    image: woodenCrate,
    type: "ALL"
  },
  {
    id: 3,
    name: "Consumable Crate",
    price: "100",
    image: woodenCrate,
    type: "OFFERS"
  },
  {
    id: 4,
    name: "Consumable Crate",
    price: "100",
    image: woodenCrate,
    type: "ALL"
  },
  {
    id: 5,
    name: "Epic Crate",
    price: "500",
    image: metalCrate,
    type: "LIMITED"
  },
  {
    id: 6,
    name: "Basic Crate",
    price: "500",
    image: metalCrate,
    type: "ALL"
  },
  {
    id: 7,
    name: "Basic Crate",
    price: "500",
    image: metalCrate,
    type: "OFFERS"
  },
  {
    id: 8,
    name: "Basic Crate",
    price: "500",
    image: metalCrate,
    type: "LIMITED"
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [userCurrency] = useState({
    silver: 163543,
    gold: 163543,
    premium: 163543
  });

  const tabs = ["ALL", "OFFERS", "LIMITED"];
  
  const filteredCrates = crateData.filter(crate => 
    activeTab === "ALL" || crate.type === activeTab
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white font-inter relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='military' x='0' y='0' width='50' height='50' patternUnits='userSpaceOnUse'%3E%3Cpath d='M25 0l25 25-25 25-25-25z' fill='%23333' opacity='0.1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='%23000'/%3E%3Crect width='100' height='100' fill='url(%23military)'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-5xl font-bold text-white tracking-wider uppercase">
            CRATES
          </h1>
          
          {/* Currency Display */}
          <div className="flex items-center gap-4">
            {/* Silver Currency */}
            <div className="flex items-center gap-3 bg-black/60 rounded-lg px-4 py-2 border border-gray-600">
              <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              </div>
              <span className="text-white font-medium">{userCurrency.silver.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>

            {/* Gold Currency */}
            <div className="flex items-center gap-3 bg-black/60 rounded-lg px-4 py-2 border border-yellow-600">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-800 rounded-full"></div>
              </div>
              <span className="text-white font-medium">{userCurrency.gold.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>

            {/* Premium Currency */}
            <div className="flex items-center gap-3 bg-black/60 rounded-lg px-4 py-2 border border-blue-600">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
              </div>
              <span className="text-white font-medium">{userCurrency.premium.toLocaleString()}</span>
              <button className="w-6 h-6 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-bold transition-colors flex items-center justify-center">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-0 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-sm font-medium transition-colors border border-gray-600 ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-white/10"
              } first:rounded-l-lg last:rounded-r-lg`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Crates Grid - 2 rows x 4 columns */}
        <div className="grid grid-cols-4 grid-rows-2 gap-6 max-w-6xl mx-auto">
          {filteredCrates.map((crate) => (
            <div key={crate.id} className="bg-black/50 rounded-lg overflow-hidden group hover:bg-black/60 transition-colors relative backdrop-blur-sm border border-gray-700">
              {/* NEW Tag */}
              {crate.tag && (
                <div className="absolute top-3 right-3 bg-yellow-500 text-black text-xs px-3 py-1 rounded font-bold z-10">
                  {crate.tag}
                </div>
              )}
              
              {/* Crate Content */}
              <div className="p-4">
                {/* Crate Name */}
                <h3 className="text-white font-medium text-lg mb-4 text-left">
                  {crate.name}
                </h3>
                
                {/* Crate Image */}
                <div className="aspect-square bg-transparent flex items-center justify-center mb-4 relative">
                  <img
                    src={crate.image}
                    alt={crate.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Price box in bottom right of image area */}
                  <div className="absolute bottom-2 right-2 bg-yellow-600 text-black rounded px-2 py-1 flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm font-bold">{crate.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrow */}
        <div className="fixed bottom-8 left-8">
          <button className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/50 rounded-lg px-4 py-2 border border-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}