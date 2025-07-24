import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import CrateSpinner from "../components/OpenCrates/CrateSpinner";

// Sample crate content - weapons with different rarities
const crateContent = [
  {
    tag: "inventory.weapon.x20_alpha_mafia",
    rarity: 1, // Legendary
    type: "Assault Rifle",
    material_id: "x20_alpha_mafia",
    image: "/lovable-uploads/79a93606-dd97-4941-aee8-0ec7ba35d91d.png"
  },
  {
    tag: "inventory.weapon.x20_alpha_havogator", 
    rarity: 4, // Uncommon
    type: "Assault Rifle",
    material_id: "x20_alpha_havogator",
    image: "/lovable-uploads/1fc451c7-c85d-4485-a24a-cf510cd8bdb2.png"
  },
  {
    tag: "inventory.weapon.x20_alpha_cold_spike",
    rarity: 3, // Rare
    type: "Assault Rifle", 
    material_id: "x20_alpha_cold_spike",
    image: "/lovable-uploads/8354592e-52bd-4ef5-ad61-e7ce27fe9fb4.png"
  },
  {
    tag: "inventory.weapon.x20_alpha_cursed",
    rarity: 2, // Epic
    type: "Assault Rifle",
    material_id: "x20_alpha_cursed"
  },
  {
    tag: "inventory.weapon.x20_alpha_common",
    rarity: 5, // Common
    type: "Assault Rifle", 
    material_id: "x20_alpha_common"
  }
];

// Featured weapons to display at top
const featuredWeapons = [
  {
    name: "X20-Alpha",
    variant: "Mafia's Fortune",
    rarity: "Legendary",
    rarityColor: "border-yellow-400 bg-yellow-900/20",
    image: "/lovable-uploads/79a93606-dd97-4941-aee8-0ec7ba35d91d.png"
  },
  {
    name: "X20-Alpha", 
    variant: "Havogator",
    rarity: "Uncommon",
    rarityColor: "border-green-400 bg-green-900/20",
    image: "/lovable-uploads/1fc451c7-c85d-4485-a24a-cf510cd8bdb2.png"
  },
  {
    name: "X20-Alpha",
    variant: "Cold Spike", 
    rarity: "Rare",
    rarityColor: "border-blue-400 bg-blue-900/20",
    image: "/lovable-uploads/8354592e-52bd-4ef5-ad61-e7ce27fe9fb4.png"
  }
];

export default function CrateOpening() {
  const navigate = useNavigate();
  const { crateId } = useParams();
  const [spinPhase, setSpinPhase] = useState<'idle' | 'spinning' | 'stopping'>('idle');
  const [reward, setReward] = useState<typeof crateContent[0] | null>(null);
  const [timeLeft, setTimeLeft] = useState("04:38:42");

  const handleSpin = () => {
    if (spinPhase === 'idle') {
      // Select random reward
      const randomReward = crateContent[Math.floor(Math.random() * crateContent.length)];
      setReward(randomReward);
      
      // Start spinning phase
      setSpinPhase('spinning');
      
      // After 2 seconds, switch to stopping phase
      setTimeout(() => {
        setSpinPhase('stopping');
      }, 2000);
    }
  };

  const handleSpinComplete = () => {
    setSpinPhase('idle');
    // Here you could show reward popup or other game effects
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat text-white font-inter relative"
      style={{
        backgroundImage: `url('/lovable-uploads/f9987673-c8de-4920-b57a-f71676ddc59b.png')`,
      }}
    >
      {/* Header */}
      <div className="relative z-10 px-16 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white tracking-wider uppercase">
            X20 BUNDLE CRATE
          </h1>
          
          {/* Currency Display */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2">
              <img 
                src="/lovable-uploads/428df05c-38d0-45a2-9460-a7b60e4421c3.png" 
                alt="Silver currency" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-white text-sm font-medium">163,543</span>
            </div>
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2 border border-yellow-600/50">
              <img 
                src="/lovable-uploads/547bb319-869e-4942-ac3b-c63e122319c2.png" 
                alt="Gold currency" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-white text-sm font-medium">163,543</span>
            </div>
            <div className="flex items-center gap-2 bg-black/80 rounded-lg px-3 py-2 border border-blue-600/50">
              <img 
                src="/lovable-uploads/82737bb3-3249-4830-bebe-e7eb5f55e420.png" 
                alt="Premium currency" 
                className="w-5 h-5 object-contain"
              />
              <span className="text-white text-sm font-medium">163,543</span>
            </div>
          </div>
        </div>

        {/* Upper Section - Spinning Area */}
        <div className="flex-1 flex flex-col items-center justify-center mb-8">
          {/* Spinning Items Display */}
          <div className="mb-8">
            <CrateSpinner
              content={crateContent}
              reward={reward}
              spinning={spinPhase !== 'idle'}
              onComplete={handleSpinComplete}
              spinPhase={spinPhase}
            />
          </div>

          {/* Spin Button and Timer */}
          <div className="text-center">
            <button
              onClick={handleSpin}
              disabled={spinPhase !== 'idle'}
              className={`bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-black font-bold py-4 px-16 rounded-lg text-xl transition-colors ${
                spinPhase !== 'idle' ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {spinPhase === 'idle' ? 'SPIN' : 'SPINNING...'}
            </button>
            <div className="mt-2 text-sm text-gray-300">
              UNLOCKS IN: {timeLeft}
            </div>
          </div>
        </div>

        {/* Items Grid - showing all possible items */}
        <div className="bg-black/40 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4 text-sm text-gray-300">
            <span>ℹ</span>
            <span>By opening this set, you will receive one of these items.</span>
          </div>
          
          <div className="grid grid-cols-10 gap-2">
            {Array(20).fill(null).map((_, index) => {
              const item = crateContent[index % crateContent.length];
              return (
                <div key={index} className="bg-black/60 border border-gray-600 rounded p-2 text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-800 rounded flex items-center justify-center">
                    {item.image ? (
                      <img 
                        src={item.image}
                        alt="Weapon"
                        className="w-12 h-12 object-contain"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-300 truncate">
                    X20-Alpha
                  </div>
                  <div className="text-xs text-yellow-400 truncate">
                    [{item.tag.includes('mafia') ? 'Mafia\'s Fortune' : 
                      item.tag.includes('havogator') ? 'Havogator' : 
                      item.tag.includes('cold') ? 'Cold Spike' : 'Variant'}]
                  </div>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xs">⚠</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="fixed bottom-8 left-8">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center justify-center text-white bg-black/60 rounded-lg p-4 border border-gray-600 hover:bg-black/80 transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
}