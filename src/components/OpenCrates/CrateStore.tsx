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
        // Mock data for demo
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
    <div className="p-6 text-white max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Open Crates</h1>
      <p className="mb-6 text-gray-300">Purchase and open exclusive crates to unlock rare items and rewards!</p>
      
      <div className="flex items-center mb-6">
        <span className="mr-2 text-lg">Choose a Crate Type:</span>
        <select
          value={selectedCrateType}
          onChange={(e) => setSelectedCrateType(e.target.value)}
          className="w-32 text-sm py-1 px-2 bg-gray-800 border border-gray-600 rounded text-white"
        >
          {CRATE_TYPES.map(type => (
            <option key={type.value} value={type.value}>{type.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {crates.map((crate) => (
          <div key={crate.guid} className={`bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center transition-all duration-500 border ${
            successCrate === crate.guid 
              ? 'border-green-400 bg-green-900/20 scale-105 shadow-green-400/50 shadow-2xl animate-pulse' 
              : 'border-gray-700 hover:scale-105'
          }`}>
            <img 
              src={getCrateImage(crate.name)} 
              alt="Crate" 
              className="w-30 h-30 mb-4 rounded-lg shadow object-cover"
            />
            <span className="bg-blue-700 text-xs px-3 py-1 rounded-full mb-2">
              {crate.name.replace(/"/g, '')}
            </span>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-400 font-semibold">Price:</span>
              <span>{crate.price}</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400 font-semibold">Items:</span>
              <span>{crate.content?.length || 0}</span>
            </div>
            <div className="flex gap-2 w-full">
              <button
                className="flex-1 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                onClick={() => onViewCrate(crate)}
              >
                <span role="img" aria-label="eye">👁️</span> View
              </button>
              <button
                className={`flex-1 px-4 py-2 rounded transition-all duration-300 flex items-center justify-center gap-1 font-semibold ${
                  buying === crate.guid 
                    ? 'bg-yellow-600 hover:bg-yellow-700 animate-pulse' 
                    : successCrate === crate.guid
                    ? 'bg-green-600 hover:bg-green-700 animate-bounce'
                    : 'bg-green-600 hover:bg-green-700 hover:scale-105'
                }`}
                disabled={buying === crate.guid}
                onClick={() => handleBuyCrate(crate)}
              >
                {buying === crate.guid ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Buying...
                  </>
                ) : successCrate === crate.guid ? (
                  <>
                    <span className="text-xl">✅</span> Purchased!
                  </>
                ) : (
                  <>
                    <span role="img" aria-label="cart">🛒</span> Buy
                  </>
                )}
              </button>
            </div>
            {buyMessage && (buying === crate.guid || successCrate === crate.guid) && (
              <div className={`mt-4 text-center text-lg font-bold w-full rounded-lg p-3 shadow-lg transition-all duration-500 ${
                successCrate === crate.guid 
                  ? 'text-green-300 bg-green-800/50 border border-green-400/50 animate-fade-in' 
                  : 'text-yellow-300 bg-yellow-800/50 border border-yellow-400/50'
              }`}>
                {buyMessage}
                {successCrate === crate.guid && (
                  <div className="mt-2 text-sm text-green-200">
                    Check your inventory for the new crate!
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Confetti Animation */}
      {showConfetti && <Confetti />}
    </div>
  );
};

export default CrateStore;