
import React, { useRef, useState, useEffect } from "react";
import CrateStore from "@/components/OpenCrates/CrateStore";
import CrateDetail from "@/components/OpenCrates/CrateDetail";
import CrateSpinner from "@/components/OpenCrates/CrateSpinner";

// Simple Modal component
function FullscreenCrateModal({ isOpen, onClose, onSpin, spinning, carouselItems, winnerIndex, crateContent, winningTag, spinReward, spinPhase, pendingReward }: any) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showWin, setShowWin] = useState(false);
  const [spinOffset, setSpinOffset] = useState(0);
  const animationRef = useRef<number>();

  // Animation effects for casino-style spinning
  useEffect(() => {
    if (spinPhase === 'spinning') {
      setSpinOffset(0);
      let offset = 0;
      let speed = 30; // Start fast
      let lastTime = performance.now();
      
      const animate = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;
        offset += speed * (delta / 16);
        setSpinOffset(offset);
        
        if (spinPhase === 'spinning') {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [spinPhase]);

  // Deceleration phase - slow down and stop at winner
  useEffect(() => {
    if (spinPhase === 'stopping' && winningTag) {
      const winnerItemIndex = crateContent?.findIndex((item: any) => item.tag === winningTag) || 0;
      // Use consistent responsive calculations
      const itemWidth = window.innerWidth < 640 ? 208 : window.innerWidth < 768 ? 248 : 288;
      const targetOffset = winnerItemIndex * itemWidth;
      const currentOffset = spinOffset;
      const distance = targetOffset - (currentOffset % (crateContent?.length * itemWidth || itemWidth));
      const finalOffset = currentOffset + distance + (crateContent?.length * itemWidth * 3 || itemWidth); // Add extra spins
      
      const duration = 2000; // 2 seconds deceleration
      const startTime = performance.now();
      const startOffset = currentOffset;
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease out cubic for smooth deceleration
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentAnimOffset = startOffset + (finalOffset - startOffset) * easeOut;
        setSpinOffset(currentAnimOffset);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Animation complete
          setTimeout(() => setShowWin(true), 300);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [spinPhase, winningTag, crateContent, spinOffset]);

  // Reset animation when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSpinOffset(0);
      setShowWin(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isOpen]);

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

        {/* Featured Items (Top 3) - Spinning Carousel */}
        <div className="relative mb-8 px-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[900px] min-h-[240px] flex items-center justify-center">
              {/* Center highlight box - responsive */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[240px] md:w-[280px] h-[180px] sm:h-[200px] md:h-[220px] border-4 border-yellow-400 rounded-lg bg-yellow-400/10 z-10 pointer-events-none"></div>
              
              {/* Spinning items container - showing only 3 items */}
              <div 
                className="flex gap-2 sm:gap-4 md:gap-8 absolute left-1/2 top-1/2 transform -translate-y-1/2 transition-transform duration-75"
                style={{
                  transform: `translateX(calc(-50% - ${spinOffset}px)) translateY(-50%)`,
                  willChange: 'transform'
                }}
              >
                {/* Repeat items for smooth infinite scroll */}
                {crateContent && (() => {
                  const repeatedItems = Array(15).fill(crateContent).flat();
                  const originalLength = crateContent.length;
                  const itemWidth = window.innerWidth < 640 ? 208 : window.innerWidth < 768 ? 248 : 288;
                  const totalWidth = originalLength * itemWidth;
                  const visibilityRange = window.innerWidth < 768 ? 350 : 500;
                  
                   return repeatedItems.map((item: any, idx: number) => {
                     // Calculate position with proper infinite scroll
                     const currentPosition = (idx * itemWidth) - (spinOffset % totalWidth);
                     const isVisible = Math.abs(currentPosition) < visibilityRange;
                   
                     if (!isVisible) return null;
                   
                     return (
                       <div 
                         key={idx} 
                         className={`relative p-2 sm:p-3 md:p-4 rounded-lg border-2 flex-shrink-0 transition-all duration-300 ${
                           Math.abs(currentPosition) < 15 ? 'border-yellow-400 bg-yellow-500/20 scale-105' : 
                           'border-gray-600 bg-gray-800/50 scale-95'
                         }`} 
                         style={{
                           width: window.innerWidth < 640 ? '200px' : window.innerWidth < 768 ? '240px' : '280px',
                           height: window.innerWidth < 640 ? '180px' : window.innerWidth < 768 ? '200px' : '220px'
                         }}
                       >
                         <div className="text-center h-full flex flex-col">
                           <div className="text-sm sm:text-base md:text-lg font-bold text-white mb-1 sm:mb-2 leading-tight">
                             {item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                           </div>
                           <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded mb-1 sm:mb-2">
                             <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop" alt={item.tag} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
                           </div>
                           <div className={`text-xs sm:text-sm font-semibold ${getRarityColor(item.rarity)}`}>
                             {getRarityName(item.rarity)}
                           </div>
                         </div>
                         {Math.abs(currentPosition) < 15 && spinPhase === 'idle' && winningTag && (
                           <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 bg-yellow-500 text-black px-1 sm:px-2 py-1 rounded text-xs font-bold">
                             Winner!
                           </div>
                         )}
                       </div>
                     );
                   });
                 })()}
              </div>
            </div>
          </div>
        </div>

        {/* Arrow pointing down */}
        <div className="flex justify-center mb-4">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[25px] border-transparent border-t-yellow-400"></div>
        </div>

        {/* SPIN Button */}
        <div className="flex justify-center mb-8">
          <button
            className="px-20 py-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-2xl disabled:opacity-60 shadow-lg transition-all duration-200"
            onClick={onSpin}
            disabled={spinning || winnerIndex !== null}
          >
            {spinning ? 'Spinning...' : 'SPIN'}
          </button>
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
