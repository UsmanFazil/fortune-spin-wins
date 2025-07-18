
import React, { useRef, useState, useEffect } from "react";
import CrateStore from "@/components/OpenCrates/CrateStore";
import CrateDetail from "@/components/OpenCrates/CrateDetail";
import CrateSpinner from "@/components/OpenCrates/CrateSpinner";

// Simple Modal component
function FullscreenCrateModal({ isOpen, onClose, onSpin, spinning, carouselItems, winnerIndex, crateContent, winningTag, spinReward, spinPhase, pendingReward }: any) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [showWin, setShowWin] = useState(false);

  // Animate carousel to winning item when winnerIndex changes
  useEffect(() => {
    if (winnerIndex !== null && carouselRef.current) {
      const cardWidth = 160; // w-40 = 10rem = 160px
      const gap = 24; // gap-6 = 1.5rem = 24px
      const scrollTo = (cardWidth + gap) * winnerIndex - (carouselRef.current.offsetWidth / 2) + (cardWidth / 2);
      carouselRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
      // Show win message after a short delay
      setTimeout(() => setShowWin(true), 400);
    } else {
      setShowWin(false);
    }
  }, [winnerIndex]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-95 backdrop-blur-sm w-screen h-screen overflow-y-auto">
      <div className="relative w-full h-full flex flex-col">
        {/* Close button */}
        <button
          className="absolute top-8 right-12 text-gray-400 hover:text-white text-4xl font-bold z-20"
          onClick={onClose}
        >
          ×
        </button>
        {/* Crate Content Thumbnails */}
        <div className="w-full flex flex-col items-center pt-12 pb-4">
          <h2 className="text-2xl font-bold mb-2 text-center tracking-wide">Crate Content</h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
            {crateContent && crateContent.length > 0 ? crateContent.map((item: any, idx: number) => (
              <div key={idx} className={`flex flex-col items-center p-1 rounded-lg border-2 ${winningTag && winningTag === item.tag ? 'border-green-400 bg-yellow-900' : 'border-gray-700 bg-zinc-800'} transition-all duration-300`} style={{width:48, height:64}}>
                <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=40&h=40&fit=crop" alt={item.tag} className="w-10 h-10" />
                <div className="text-[10px] text-white text-center truncate w-11 mt-1">{item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}</div>
              </div>
            )) : <div className="text-white">Loading...</div>}
          </div>
        </div>
        {/* Carousel Animation */}
        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-full flex justify-center items-center">
            <div
              ref={carouselRef}
              className="overflow-x-auto w-[1200px] h-[220px] bg-zinc-800 rounded-2xl border-8 border-yellow-400 flex items-center relative scrollbar-hide shadow-2xl"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex gap-6 w-fit h-full items-center px-16">
                {carouselItems && carouselItems.length > 0 ? (
                  carouselItems.map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className={`w-40 h-40 flex items-center justify-center rounded-2xl transition-all duration-300 ${winnerIndex === idx ? 'border-8 border-green-400 bg-yellow-900 shadow-2xl scale-125' : 'border-4 border-gray-700 bg-zinc-900'}`}
                      style={winnerIndex === idx ? { boxShadow: '0 0 64px 16px #facc15' } : {}}
                    >
                      <img src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop" alt={item.tag} className="w-30 h-30" />
                    </div>
                  ))
                ) : (
                  <div className="text-white">Loading...</div>
                )}
              </div>
              {/* Winner highlight overlay */}
              <div className="absolute left-1/2 top-0 -translate-x-1/2 w-40 h-full border-l-8 border-r-8 border-yellow-400 pointer-events-none" style={{zIndex: 10}}></div>
            </div>
          </div>
          {/* SPIN button */}
          <button
            className="mt-12 px-16 py-6 bg-yellow-600 rounded-2xl hover:bg-yellow-700 font-bold text-3xl disabled:opacity-60 shadow-lg"
            onClick={onSpin}
            disabled={spinning || winnerIndex !== null}
          >
            {spinning ? 'Spinning...' : 'SPIN'}
          </button>
          {/* Victory animation/message */}
          {showWin && spinReward && (
            <div className="mt-10 flex flex-col items-center animate-bounce">
              <div className="text-5xl mb-2">🎉</div>
              <div className="text-3xl font-bold text-green-400 mb-2 animate-pulse">Hurray! You win:</div>
              <div className="text-2xl font-bold text-yellow-300 animate-fade-in">
                {spinReward.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2 animate-pulse">Check Your inventory to view this item in a game</div>
            </div>
          )}
        </div>
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
