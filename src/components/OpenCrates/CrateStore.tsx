import React, { useEffect, useState } from "react";
import Confetti from "../Confetti";

const getCrateImage = (crateName: string) => {
  if (crateName.toLowerCase().includes('hostile')) return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop";
  if (crateName.toLowerCase().includes('vanity')) return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop";
  return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop"; // fallback
};

const CRATE_TYPES = [
  { name: 'Legacy Box', value: 'legacyBox' },
  { name: 'Vanity Crate', value: 'vanityCrate' },
];

interface Crate {
  guid: string;
  name: string;
  price: string;
  content?: any[];
}

interface CrateStoreProps {
  onViewCrate: (crate: Crate) => void;
  playerId: string;
  onBuySuccess?: () => void;
}

const CrateStore: React.FC<CrateStoreProps> = ({ onViewCrate, playerId, onBuySuccess }) => {
  const [crates, setCrates] = useState<Crate[]>([]);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState<string | null>(null);
  const [buyMessage, setBuyMessage] = useState("");
  const [selectedCrateType, setSelectedCrateType] = useState(CRATE_TYPES[0].value);
  const [showConfetti, setShowConfetti] = useState(false);
  const [successCrate, setSuccessCrate] = useState<string | null>(null);

  useEffect(() => {
    const fetchCrates = async () => {
      try {
        // Mock data for demo with more crates
        const mockCrates = [
          {
            guid: "crate-1",
            name: "Hostile Legacy Box",
            price: "100 SHOTS",
            content: Array(5).fill(null).map((_, i) => ({ id: i, name: `Item ${i + 1}` }))
          },
          {
            guid: "crate-2", 
            name: "Vanity Crate",
            price: "50 SHOTS",
            content: Array(3).fill(null).map((_, i) => ({ id: i, name: `Vanity ${i + 1}` }))
          },
          {
            guid: "crate-3",
            name: "Elite Weapon Case",
            price: "200 SHOTS",
            content: Array(8).fill(null).map((_, i) => ({ id: i, name: `Elite ${i + 1}` }))
          },
          {
            guid: "crate-4",
            name: "Classic Collection",
            price: "75 SHOTS",
            content: Array(6).fill(null).map((_, i) => ({ id: i, name: `Classic ${i + 1}` }))
          },
          {
            guid: "crate-5",
            name: "Premium Bundle",
            price: "300 SHOTS",
            content: Array(10).fill(null).map((_, i) => ({ id: i, name: `Premium ${i + 1}` }))
          },
          {
            guid: "crate-6",
            name: "Special Edition",
            price: "150 SHOTS",
            content: Array(7).fill(null).map((_, i) => ({ id: i, name: `Special ${i + 1}` }))
          }
        ];
        setCrates(mockCrates);
      } catch (err) {
        console.error("Failed to load crates:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCrates();
  }, []);

  const handleBuyCrate = async (crate: Crate) => {
    setBuying(crate.guid);
    setBuyMessage("⏳ Processing purchase...");
    
    // Simulate purchase
    setTimeout(() => {
      setBuyMessage("🎉 Purchase successful!");
      setSuccessCrate(crate.guid);
      setShowConfetti(true);
      setBuying(null);
      if (onBuySuccess) onBuySuccess();
      
      // Hide success state after animation
      setTimeout(() => {
        setBuyMessage("");
        setSuccessCrate(null);
        setShowConfetti(false);
      }, 4000);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="p-6 text-white max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Open Crates</h1>
        <p className="mb-6 text-gray-300">Purchase and open exclusive crates to unlock rare items and rewards!</p>
        <p>Loading crates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-blue-800/20"></div>
        <div className="relative p-8 text-center">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            CRATE STORE
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto leading-relaxed">
            Discover premium weapon cases and exclusive collections. Open crates to unlock legendary items and rare rewards!
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="px-8 mb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold text-purple-200">Filter by:</span>
              <select
                value={selectedCrateType}
                onChange={(e) => setSelectedCrateType(e.target.value)}
                className="bg-slate-800/80 border border-purple-500/30 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {CRATE_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.name}</option>
                ))}
              </select>
            </div>
            <div className="text-purple-200">
              <span className="text-sm">Showing {crates.length} crates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Crates Grid */}
      <div className="px-8 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {crates.map((crate) => (
              <div 
                key={crate.guid} 
                className={`group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl border border-slate-600/30 overflow-hidden transition-all duration-500 hover:scale-105 hover:border-purple-500/50 ${
                  successCrate === crate.guid 
                    ? 'border-green-400 bg-green-900/20 scale-105 shadow-green-400/50 shadow-2xl animate-pulse' 
                    : 'hover:shadow-2xl hover:shadow-purple-500/20'
                }`}
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Content */}
                <div className="relative p-6 text-center">
                  {/* Crate Image */}
                  <div className="relative mb-6">
                    <div className="w-32 h-32 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
                      <img 
                        src={getCrateImage(crate.name)} 
                        alt="Crate" 
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    </div>
                    {/* Floating Elements */}
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full animate-pulse"></div>
                    <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-cyan-500 rounded-full animate-pulse delay-300"></div>
                  </div>

                  {/* Crate Info */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">
                      {crate.name.replace(/"/g, '')}
                    </h3>
                    
                    <div className="flex justify-center items-center gap-2">
                      <div className="px-3 py-1 bg-purple-600/30 rounded-full border border-purple-500/30">
                        <span className="text-sm font-medium text-purple-200">
                          {crate.content?.length || 0} Items
                        </span>
                      </div>
                    </div>

                    <div className="text-2xl font-bold text-cyan-400">
                      {crate.price}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 space-y-3">
                    <button
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl font-semibold text-white transition-all duration-300 hover:from-purple-500 hover:to-cyan-500 hover:shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2"
                      onClick={() => onViewCrate(crate)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Contents
                    </button>
                    
                    <button
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        buying === crate.guid 
                          ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse' 
                          : successCrate === crate.guid
                          ? 'bg-green-600 hover:bg-green-700 animate-bounce'
                          : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:shadow-lg hover:shadow-green-500/25'
                      }`}
                      disabled={buying === crate.guid}
                      onClick={() => handleBuyCrate(crate)}
                    >
                      {buying === crate.guid ? (
                        <>
                          <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                          Processing...
                        </>
                      ) : successCrate === crate.guid ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Purchased!
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13M7 13l-2.293 2.293A1 1 0 004 16h9m0 0v6a2 2 0 002 2h2a2 2 0 002-2v-6m-6 0H9" />
                          </svg>
                          Purchase Crate
                        </>
                      )}
                    </button>
                  </div>

                  {/* Success Message */}
                  {buyMessage && (buying === crate.guid || successCrate === crate.guid) && (
                    <div className={`mt-4 p-4 rounded-xl border transition-all duration-500 ${
                      successCrate === crate.guid 
                        ? 'text-green-300 bg-green-900/50 border-green-400/50 animate-fade-in' 
                        : 'text-yellow-300 bg-yellow-900/50 border-yellow-400/50'
                    }`}>
                      <div className="font-bold text-lg">{buyMessage}</div>
                      {successCrate === crate.guid && (
                        <div className="mt-2 text-sm text-green-200">
                          Crate added to your inventory!
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}
    </div>
  );
};

export default CrateStore;