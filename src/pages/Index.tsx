
import React, { useRef, useState, useEffect } from "react";
import CrateStore from "@/components/OpenCrates/CrateStore";
import CrateDetail from "@/components/OpenCrates/CrateDetail";
import CrateSpinner from "@/components/OpenCrates/CrateSpinner";

// Simple Modal component
function FullscreenCrateModal({ isOpen, onClose, onSpin, spinning, carouselItems, winnerIndex, crateContent, winningTag, spinReward, spinPhase, pendingReward }: any) {
  const [showWin, setShowWin] = useState(false);

  useEffect(() => {
    if (winnerIndex !== null) {
      setTimeout(() => setShowWin(true), 400);
    } else {
      setShowWin(false);
    }
  }, [winnerIndex]);

  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1: return "border-yellow-400 bg-yellow-500/20 text-yellow-400"; // Legendary
      case 2: return "border-purple-400 bg-purple-500/20 text-purple-400"; // Epic
      case 3: return "border-blue-400 bg-blue-500/20 text-blue-400"; // Rare
      case 4: return "border-green-400 bg-green-500/20 text-green-400"; // Uncommon
      case 5: return "border-gray-400 bg-gray-500/20 text-gray-400"; // Common
      default: return "border-gray-400 bg-gray-500/20 text-gray-400";
    }
  };

  const getRarityName = (rarity: number) => {
    switch (rarity) {
      case 1: return "Legendary";
      case 2: return "Epic";
      case 3: return "Rare";
      case 4: return "Uncommon";
      case 5: return "Common";
      default: return "Common";
    }
  };

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black w-screen h-screen overflow-y-auto">
      <div className="relative w-full h-full flex flex-col text-white" style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)',
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.02) 20px,
            rgba(255, 255, 255, 0.02) 22px
          ),
          repeating-linear-gradient(
            60deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.02) 20px,
            rgba(255, 255, 255, 0.02) 22px
          ),
          repeating-linear-gradient(
            120deg,
            transparent,
            transparent 20px,
            rgba(255, 255, 255, 0.02) 20px,
            rgba(255, 255, 255, 0.02) 22px
          )
        `
      }}>
        {/* Close button */}
        <button
          className="absolute top-8 right-12 text-gray-400 hover:text-white text-4xl font-bold z-20"
          onClick={onClose}
        >
          ×
        </button>
        
        {/* Header */}
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-white mb-2">HOSTILE LEGACY BOX</h1>
        </div>

        {/* Featured Items (Top 3) */}
        <div className="flex justify-center gap-8 mb-12">
          {crateContent && crateContent.slice(0, 3).map((item: any, idx: number) => (
            <div key={idx} className={`relative p-4 rounded-lg border-2 ${
              idx === 1 ? 'border-yellow-400 bg-yellow-500/20' : 
              winningTag && winningTag === item.tag ? 'border-yellow-400 bg-yellow-500/20' : 
              'border-gray-600 bg-gray-800/50'
            } transition-all duration-300`} style={{width: 280, height: 200}}>
              <div className="text-center h-full flex flex-col">
                <div className="text-lg font-bold text-white mb-2">
                  {item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded mb-2">
                  <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop" alt={item.tag} className="w-30 h-30 object-contain" />
                </div>
                <div className={`text-sm font-semibold ${getRarityColor(item.rarity)}`}>
                  {getRarityName(item.rarity)}
                </div>
              </div>
              {idx === 1 && (
                <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                  Default
                </div>
              )}
            </div>
          ))}
        </div>

        {/* SPIN Button */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-b-6 border-transparent border-b-yellow-400"></div>
            </div>
            <button
              className="px-20 py-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-2xl disabled:opacity-60 shadow-lg transition-all duration-200"
              onClick={onSpin}
              disabled={spinning || winnerIndex !== null}
            >
              {spinning ? 'Spinning...' : 'SPIN'}
            </button>
          </div>
        </div>

        {/* Info Text */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>By opening this set, you will receive one of these items.</span>
          </div>
        </div>

        {/* All Items Grid */}
        <div className="flex-1 px-8 pb-8">
          <div className="grid grid-cols-5 gap-4 max-w-6xl mx-auto">
            {crateContent && crateContent.map((item: any, idx: number) => (
              <div key={idx} className={`relative p-3 rounded-lg border-2 ${winningTag && winningTag === item.tag ? 'border-yellow-400 bg-yellow-500/20' : 'border-gray-600 bg-gray-800/50'} transition-all duration-300`}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-900/50 rounded flex items-center justify-center">
                    <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=48&h=48&fit=crop" alt={item.tag} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="text-xs font-bold text-white mb-1">
                    {item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                  </div>
                  <div className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>
                    {getRarityName(item.rarity)}
                  </div>
                </div>
                {winningTag && winningTag === item.tag && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-black text-xs font-bold">!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Winner Message */}
        {showWin && spinReward && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-30">
            <div className="text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-4xl font-bold text-green-400 mb-2">Congratulations!</div>
              <div className="text-2xl font-bold text-yellow-300 mb-4">
                You won: {spinReward.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
              </div>
              <div className="text-lg text-gray-300">
                Check your inventory to view this item in game
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const Index = () => {
  const [currentView, setCurrentView] = useState('owned'); // 'owned', 'store', 'detail', 'spinner'
  const [ownedCrates, setOwnedCrates] = useState<any[]>([]);
  const [ownedLoading, setOwnedLoading] = useState(true);
  const [selectedCrate, setSelectedCrate] = useState<any>(null);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState<any>(null);
  const [crateContent, setCrateContent] = useState<any>(null);
  const [openedCrateGuid, setOpenedCrateGuid] = useState<string | null>(null);
  const [openedCrateContent, setOpenedCrateContent] = useState<any>(null);
  const [spinReward, setSpinReward] = useState<any>(null);
  const [spinningOwned, setSpinningOwned] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselItems, setCarouselItems] = useState<any[]>([]);
  const [winnerIndex, setWinnerIndex] = useState<number | null>(null);
  const [winningTag, setWinningTag] = useState<string | null>(null);
  const [spinPhase, setSpinPhase] = useState('idle');
  const [pendingReward, setPendingReward] = useState<any>(null);

  const playerId = "player123";

  // Mock owned crates
  const refreshOwnedCrates = () => {
    setOwnedLoading(true);
    // Mock data
    setTimeout(() => {
      const mockOwnedCrates = [
        {
          guid: "owned-1",
          crate_name: "Hostile Legacy Box",
          content: [
            { tag: "inventory.weapon.revolver", rarity: 5 },
            { tag: "inventory.weapon.assaultrifle", rarity: 4 },
            { tag: "inventory.weapon.shotgun", rarity: 3 }
          ]
        },
        {
          guid: "owned-2", 
          crate_name: "Vanity Crate",
          content: [
            { tag: "inventory.weapon.sniperrifle", rarity: 2 },
            { tag: "inventory.weapon.rocketlauncher", rarity: 1 }
          ]
        }
      ];
      setOwnedCrates(mockOwnedCrates);
      setOwnedLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (currentView === 'owned') {
      refreshOwnedCrates();
    }
  }, [currentView]);

  const handleViewCrate = (crate: any) => {
    setSelectedCrate(crate);
    setCurrentView('detail');
  };

  const handleBuyCrate = () => {
    setCurrentView('store');
  };

  const getCrateImage = (crateName: string) => {
    if (crateName.toLowerCase().includes('hostile')) return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop";
    if (crateName.toLowerCase().includes('vanity')) return "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop";
    return "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop";
  };

  const handleOpenOwnedCrate = async (crate: any) => {
    setSelectedCrate(crate);
    setOpenedCrateGuid(crate.guid);
    setOpenedCrateContent(null);
    setSpinReward(null);
    setSpinningOwned(false);
    setModalOpen(true);
    
    // Mock crate content
    const mockContent = [
      { tag: "inventory.weapon.revolver", rarity: 5 },
      { tag: "inventory.weapon.assaultrifle", rarity: 4 },
      { tag: "inventory.weapon.shotgun", rarity: 3 },
      { tag: "inventory.weapon.sniperrifle", rarity: 2 },
      { tag: "inventory.weapon.rocketlauncher", rarity: 1 }
    ];
    setOpenedCrateContent(mockContent);
  };

  useEffect(() => {
    if (modalOpen && openedCrateContent && openedCrateContent.length > 0) {
      let repeated: any[] = [];
      while (repeated.length < 20) {
        repeated = repeated.concat(openedCrateContent);
      }
      setCarouselItems(repeated.slice(0, 20));
      setWinnerIndex(null);
      setWinningTag(null);
    }
  }, [modalOpen, openedCrateContent]);

  const handleSpinOwnedCrate = async (crate: any) => {
    setSpinPhase('spinning');
    setSpinningOwned(true);
    setSpinReward(null);
    setWinnerIndex(null);
    setWinningTag(null);
    setPendingReward(null);

    // Mock reward
    const mockReward = {
      tag: "inventory.weapon.assaultrifle",
      rarity: 4,
      type: "Weapon",
      chance: 0.25,
      material_id: "assault-rifle-id"
    };

    setTimeout(() => {
      setSpinReward(mockReward);
      setWinningTag(mockReward.tag);
      setSpinPhase('stopping');
      
      setTimeout(() => {
        if (carouselItems && mockReward.tag) {
          const idx = carouselItems.map(i => i.tag).lastIndexOf(mockReward.tag);
          setWinnerIndex(idx);
        }
        setSpinningOwned(false);
        setSpinPhase('idle');
        refreshOwnedCrates();
      }, 2000);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen bg-zinc-900 text-white p-16">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Your Crates</h1>
          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            onClick={handleBuyCrate}
          >
            Buy Crates
          </button>
        </div>

        {/* Owned Crates View */}
        {currentView === 'owned' && (
          <div>
            {ownedLoading ? (
              <p>Loading your crates...</p>
            ) : ownedCrates.length === 0 ? (
              <p>You don't own any crates yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {ownedCrates.map(crate => (
                  <div key={crate.guid} className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border border-gray-700">
                    <img src={getCrateImage(crate.crate_name)} alt="Crate" className="w-30 h-30 mb-4 rounded-lg shadow" />
                    <span className="bg-blue-700 text-xs px-3 py-1 rounded-full mb-2">{crate.crate_name.replace(/"/g, '')}</span>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-green-400 font-semibold">GUID:</span>
                      <span className="text-gray-400">{crate.guid}</span>
                    </div>
                    <button
                      className="mt-3 px-4 py-2 bg-green-600 rounded hover:bg-green-700 transition-colors w-full flex items-center justify-center gap-1"
                      onClick={() => handleOpenOwnedCrate(crate)}
                    >
                      <span role="img" aria-label="gift">🎁</span> Open
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modal for opening crate */}
        <FullscreenCrateModal
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setSpinReward(null); }}
          onSpin={() => handleSpinOwnedCrate(selectedCrate)}
          spinning={spinningOwned}
          carouselItems={carouselItems}
          winnerIndex={winnerIndex}
          crateContent={openedCrateContent || []}
          winningTag={winningTag}
          spinReward={spinReward}
          spinPhase={spinPhase}
          pendingReward={pendingReward}
        />

        {/* Store View */}
        {currentView === 'store' && (
          <div>
            <button
              onClick={() => setCurrentView('owned')}
              className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
            >
              ← Back to My Crates
            </button>
            <CrateStore onViewCrate={handleViewCrate} playerId={playerId} onBuySuccess={refreshOwnedCrates} />
          </div>
        )}

        {/* Crate Detail View */}
        {currentView === 'detail' && selectedCrate && (
          <CrateDetail 
            crate={selectedCrate} 
            playerId={playerId}
            onBack={() => setCurrentView('store')}
            onBuyCrate={handleBuyCrate}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
