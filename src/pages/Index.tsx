import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";

// Import the exact crate images you provided
import woodenCrate from "@/assets/crates/wooden-crate.png"; // Your WEAPON crate
import metalCrate from "@/assets/crates/metal-crate.png";   // Your skull crate

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
        backgroundImage: `url('/lovable-uploads/f9987673-c8de-4920-b57a-f71676ddc59b.png')`,
      }}
    >
      {/* Content - matching exact positioning from your image */}
      <div className="relative z-10 px-16 py-8">
        {/* Header with CRATES title and currency - exact positioning */}
        <div className="flex items-start justify-between mb-16">
          <h1 className="text-6xl font-bold text-white tracking-wider uppercase mt-4">
            CRATES
          </h1>
          
          {/* Currency Display - exact styling from your image */}
          <div className="flex items-center gap-4">
            {/* Silver Currency */}
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2">
              <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
              <span className="text-white text-sm font-medium">{userCurrency.silver.toLocaleString()}</span>
              <button className="w-5 h-5 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">
                +
              </button>
            </div>

            {/* Gold Currency */}
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2 border border-yellow-600/50">
              <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">{userCurrency.gold.toLocaleString()}</span>
              <button className="w-5 h-5 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">
                +
              </button>
            </div>

            {/* Premium Currency */}
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2 border border-blue-600/50">
              <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
              <span className="text-white text-sm font-medium">{userCurrency.premium.toLocaleString()}</span>
              <button className="w-5 h-5 bg-green-600 rounded text-white text-xs font-bold flex items-center justify-center">
                +
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation - exact styling from your image */}
        <div className="flex gap-0 mb-12">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-3 text-sm font-medium transition-colors border border-gray-500 ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-white/10"
              } first:rounded-l-lg last:rounded-r-lg`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Crates Grid - EXACT 2x4 layout matching your image */}
        <div className="grid grid-cols-4 grid-rows-2 gap-8 max-w-7xl">
          {filteredCrates.map((crate) => (
            <div key={crate.id} className="bg-black/60 rounded-lg overflow-hidden relative backdrop-blur-sm border border-gray-600/50">
              {/* NEW Tag - exact positioning */}
              {crate.tag && (
                <div className="absolute top-4 right-4 bg-yellow-500 text-black text-xs px-3 py-1 rounded font-bold z-20 uppercase">
                  {crate.tag}
                </div>
              )}
              
              {/* Crate Content */}
              <div className="p-6">
                {/* Crate Name - exact positioning */}
                <h3 className="text-white font-medium text-lg mb-6 text-left">
                  {crate.name}
                </h3>
                
                {/* Crate Image Container - exact sizing */}
                <div className="relative h-48 mb-4">
                  <img
                    src={crate.image}
                    alt={crate.name}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Price box - EXACT positioning and styling from your image */}
                  <div className="absolute bottom-0 right-0 bg-yellow-600 text-black rounded-sm px-3 py-2 flex items-center gap-2 border-2 border-yellow-500">
                    <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                    </div>
                    <span className="text-sm font-bold">{crate.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrow - exact positioning */}
        <div className="fixed bottom-8 left-8">
          <button className="flex items-center justify-center text-white bg-black/60 rounded-lg p-4 border border-gray-600">
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}