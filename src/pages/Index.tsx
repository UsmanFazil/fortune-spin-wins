import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import woodenCrate from "@/assets/crates/wooden-crate.png";
import metalCrate from "@/assets/crates/metal-crate.png";

const crateData = [
  {
    id: 1,
    name: "WEAPON",
    price: "1,500",
    image: woodenCrate,
    type: "ALL",
    number: "01"
  },
  {
    id: 2,
    name: "WEAPON",
    price: "1,500", 
    image: woodenCrate,
    type: "ALL",
    number: "02"
  },
  {
    id: 3,
    name: "HOSTILE",
    price: "2,000",
    image: metalCrate,
    type: "OFFERS",
    tag: "LIMITED",
    number: "03"
  },
  {
    id: 4,
    name: "VANITY",
    price: "1,000",
    image: metalCrate,
    type: "ALL",
    number: "04"
  },
  {
    id: 5,
    name: "WEAPON",
    price: "1,500",
    image: woodenCrate,
    type: "LIMITED",
    number: "05"
  },
  {
    id: 6,
    name: "HOSTILE",
    price: "2,000",
    image: metalCrate,
    type: "ALL",
    number: "06"
  },
  {
    id: 7,
    name: "VANITY",
    price: "1,000",
    image: metalCrate,
    type: "OFFERS",
    number: "07"
  },
  {
    id: 8,
    name: "WEAPON",
    price: "1,500",
    image: woodenCrate,
    type: "LIMITED",
    number: "08"
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("ALL");
  const [userCurrency] = useState({
    silver: 1284572,
    gold: 2156,
    premium: 156
  });

  const tabs = ["ALL", "OFFERS", "LIMITED"];
  
  const filteredCrates = crateData.filter(crate => 
    activeTab === "ALL" || crate.type === activeTab
  );

  return (
    <div className="min-h-screen bg-black text-white font-inter p-4">
      {/* Header with currency */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
        </div>
        
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
            <span>{userCurrency.silver.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-yellow-500 rounded-full"></div>
            <span>{userCurrency.gold.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
            <span>{userCurrency.premium}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex border border-gray-600 rounded-lg overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-white text-black"
                  : "bg-transparent text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Crates Grid */}
      <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
        {filteredCrates.map((crate) => (
          <div key={crate.id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden group hover:border-gray-500 transition-colors relative">
            {/* Crate Number */}
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded z-10">
              {crate.number}
            </div>
            
            {/* Crate Image */}
            <div className="aspect-square bg-gray-800 flex items-center justify-center p-4 relative">
              {crate.tag && (
                <div className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded z-10">
                  {crate.tag}
                </div>
              )}
              <img
                src={crate.image}
                alt={crate.name}
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* Crate Info */}
            <div className="p-4 space-y-3">
              <div className="text-center">
                <h3 className="text-white font-medium text-lg">{crate.name}</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                  <span className="text-white text-sm">{crate.price}</span>
                </div>
                <Button
                  size="sm"
                  className="bg-white text-black hover:bg-gray-200 text-xs px-3 py-1"
                >
                  OPEN
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrow */}
      <div className="fixed bottom-8 left-8">
        <Button
          variant="ghost"
          size="icon"
          className="w-12 h-12 rounded-full bg-white/10 text-white hover:bg-white/20"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}