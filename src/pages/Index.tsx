"use client";

import React, { useRef, useState, useEffect } from "react";
import CrateStore from "@/components/OpenCrates/CrateStore";
import CrateDetail from "@/components/OpenCrates/CrateDetail";
import CrateSpinner from "@/components/OpenCrates/CrateSpinner";

// Import images from assets folder (replace with actual image imports)
// import hostileLegacyBoxImg from '@/assets/images/hostile_legacy_box.png';
// import vanityCrateImg from '@/assets/images/vanity_crate.png';
// import lootCrateOpeningAnimation from '@/assets/images/LootCrateOpeningAnimation.gif';

// Placeholder images for now (replace these with actual imports)
const hostileLegacyBoxImg = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&h=120&fit=crop";
const vanityCrateImg = "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=120&h=120&fit=crop";
const lootCrateOpeningAnimation = "https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=900&h=600&fit=crop";

// Modern FullscreenCrateModal with casino-style spinning and improved visuals
function FullscreenCrateModal({ isOpen, onClose, onSpin, spinning, carouselItems, winnerIndex, crateContent, winningTag, spinReward, spinPhase, pendingReward }: any) {
  const carouselRef = useRef(null);
  const [showWin, setShowWin] = useState(false);
  const [spinOffset, setSpinOffset] = useState(0);
  const animationRef = useRef<number>();

  // Responsive item width helper
  const getItemWidth = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 208;
      if (window.innerWidth < 768) return 248;
      return 288;
    }
    return 288;
  };

  // Safe modulo for positive array indices
  function mod(n: number, m: number) {
    return ((n % m) + m) % m;
  }

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
    if (spinPhase === 'stopping' && winningTag && crateContent && crateContent.length > 0) {
      const itemWidth = getItemWidth();
      const winnerItemIndex = crateContent.findIndex((item: any) => item.tag === winningTag) || 0;
      const targetOffset = winnerItemIndex * itemWidth;
      const currentOffset = spinOffset;
      const distance = targetOffset - (currentOffset % (crateContent.length * itemWidth));
      const finalOffset = currentOffset + distance + (crateContent.length * itemWidth * 3); // Add extra spins
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
      case 1: return "border-yellow-400 bg-yellow-500/20 text-yellow-400";
      case 2: return "border-purple-400 bg-purple-500/20 text-purple-400";
      case 3: return "border-blue-400 bg-blue-500/20 text-blue-400";
      case 4: return "border-green-400 bg-green-500/20 text-green-400";
      case 5: return "border-gray-400 bg-gray-500/20 text-gray-400";
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
          repeating-linear-gradient(0deg,transparent,transparent 20px,rgba(255,255,255,0.02) 20px,rgba(255,255,255,0.02) 22px),
          repeating-linear-gradient(60deg,transparent,transparent 20px,rgba(255,255,255,0.02) 20px,rgba(255,255,255,0.02) 22px),
          repeating-linear-gradient(120deg,transparent,transparent 20px,rgba(255,255,255,0.02) 20px,rgba(255,255,255,0.02) 22px)
        `
      }}>
        <button className="absolute top-8 right-12 text-gray-400 hover:text-white text-4xl font-bold z-20" onClick={onClose}>×</button>
        <div className="text-center pt-12 pb-8">
          <h1 className="text-4xl font-bold text-white mb-2">HOSTILE LEGACY BOX</h1>
        </div>
        <div className="relative mb-8 px-4">
          <div className="flex justify-center">
            <div className="relative w-full max-w-[900px] min-h-[240px] flex items-center justify-center">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[240px] md:w-[280px] h-[180px] sm:h-[200px] md:h-[220px] border-4 border-yellow-400 rounded-lg bg-yellow-400/10 z-10 pointer-events-none"></div>
              <div 
                className="flex gap-2 sm:gap-4 md:gap-8 absolute left-1/2 top-1/2 transform -translate-y-1/2 transition-transform duration-75"
                style={{
                  transform: `translateX(calc(-50% - ${spinOffset}px)) translateY(-50%)`,
                  willChange: 'transform'
                }}
              >
              
              {crateContent && (() => {
  const itemWidth = 288;
  const totalItems = crateContent.length;

  // Number of virtual items around the center to render
  const buffer = 20; // 40 total rendered items (20 left + 20 right)
  const centerVirtualIndex = Math.floor(spinOffset / itemWidth);
  const start = centerVirtualIndex - buffer;
  const end = centerVirtualIndex + buffer;

  return Array.from({ length: end - start + 1 }, (_, i) => {
    const virtualIndex = start + i;
    const realIndex = ((virtualIndex % totalItems) + totalItems) % totalItems;
    const item = crateContent[realIndex];
    const currentPosition = (virtualIndex * itemWidth) - spinOffset;
    const isCentered = Math.abs(currentPosition) < 10;
if (!item) {
  console.warn(`Missing item at virtualIndex: ${virtualIndex}, realIndex: ${realIndex}`);
  return null;
}
    return (
      <div 
        key={`v${virtualIndex}-r${realIndex}`} 
        className={`relative p-4 rounded-lg border-2 flex-shrink-0 transition-all duration-300 ${
          isCentered ? 'border-yellow-400 bg-yellow-500/20 scale-105' :
          'border-gray-600 bg-gray-800/50 scale-95'
        }`} 
        style={{ width: 280, height: 200 }}
      >
        <div className="text-center h-full flex flex-col">
          <div className="text-lg font-bold text-white mb-2">
            {item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}
          </div>
          <div className="flex-1 flex items-center justify-center bg-gray-900/50 rounded mb-2">
            <img src={getItemImage(item.tag)} alt={item.tag} className="w-30 h-30 object-contain" style={{ width: 120, height: 120 }} />
          </div>
          <div className={`text-sm font-semibold ${getRarityColor(item.rarity)}`}>{getRarityName(item.rarity)}</div>
        </div>
        {isCentered && spinPhase === 'idle' && winningTag && (
          <div className="absolute -top-2 -right-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">Winner!</div>
        )}
      </div>
    );
  });
})()}

                
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center mb-4">
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-t-[25px] border-transparent border-t-yellow-400"></div>
        </div>
        <div className="flex justify-center mb-8">
          <button className="px-20 py-4 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold text-2xl disabled:opacity-60 shadow-lg transition-all duration-200" onClick={onSpin} disabled={spinning || winnerIndex !== null}>{spinning ? 'Spinning...' : 'SPIN'}</button>
        </div>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 text-gray-300">
            <div className="w-4 h-4 rounded-full border border-gray-400 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span>By opening this set, you will receive one of these items.</span>
          </div>
        </div>
        <div className="flex-1 px-8 pb-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {crateContent && crateContent.map((item: any, idx: number) => (
              <div key={idx} className={`relative p-3 rounded-lg border-2 ${winningTag && winningTag === item.tag ? 'border-yellow-400 bg-yellow-500/20' : 'border-gray-600 bg-gray-800/50'} transition-all duration-300`}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-2 bg-gray-900/50 rounded flex items-center justify-center">
                    <img src={getItemImage(item.tag)} alt={item.tag} className="w-12 h-12 object-contain" />
                  </div>
                  <div className="text-xs font-bold text-white mb-1">{item.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}</div>
                  <div className={`text-xs font-semibold ${getRarityColor(item.rarity)}`}>{getRarityName(item.rarity)}</div>
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
        {showWin && spinReward && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-30">
            <div className="text-center animate-bounce">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-4xl font-bold text-green-400 mb-2">Congratulations!</div>
              <div className="text-2xl font-bold text-yellow-300 mb-4">You won: {spinReward.tag?.replace('inventory.weapon.', '').replace(/_/g, ' ')}</div>
              <div className="text-lg text-gray-300 mb-6">Check your inventory to view this item in game</div>
              <button
                className="mt-4 px-8 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-bold rounded-lg text-lg shadow-lg transition-all duration-200"
                onClick={() => {
                  setShowWin(false);
                  onClose();
                }}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper to get item image (replace with your actual logic)
function getItemImage(tag: string) {
  try {
    // Basic weapon image mapping - replace with actual images
    const weaponImages: Record<string, string> = {
      'revolver': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=120&h=120&fit=crop',
      'assaultrifle': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=120&h=120&fit=crop',
      'shotgun': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=120&h=120&fit=crop',
      'sniperrifle': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=120&h=120&fit=crop',
      'rocketlauncher': 'https://images.unsplash.com/photo-1595590424283-b8f17842773f?w=120&h=120&fit=crop',
    };
    
    if (!tag) return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop';
    
    // Vanity/Cosmetic/Outfit support
    if (tag.startsWith('inventory.vanity.') || tag.startsWith('inventory.outfit.') || tag.startsWith('inventory.cosmetic.')) {
      return vanityCrateImg;
    }
    
    // Weapon support
    const match = tag.match(/^inventory\.weapon\.(.+)$/);
    if (match) {
      const weaponName = match[1].replace(/\./g, '').replace(/_/g, '').replace(/-/g, '');
      return weaponImages[weaponName] || 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop';
    }
    
    // Fallback
    return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop';
  } catch {
    return 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=120&h=120&fit=crop';
  }
}

export default function Home() {
  const [currentView, setCurrentView] = useState('owned'); // 'owned', 'store', 'detail', 'spinner'
  const [ownedCrates, setOwnedCrates] = useState([]);
  const [ownedLoading, setOwnedLoading] = useState(true);
  const [selectedCrate, setSelectedCrate] = useState(null);
  const [spinning, setSpinning] = useState(false);
  const [reward, setReward] = useState(null);
  const [crateContent, setCrateContent] = useState(null);
  const [openedCrateGuid, setOpenedCrateGuid] = useState(null);
  const [openedCrateContent, setOpenedCrateContent] = useState(null);
  const [spinReward, setSpinReward] = useState(null);
  const [spinningOwned, setSpinningOwned] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [carouselItems, setCarouselItems] = useState([]);
  const [winnerIndex, setWinnerIndex] = useState(null);
  const [winningTag, setWinningTag] = useState(null);
  // Add new state for spinner phase
  const [spinPhase, setSpinPhase] = useState('idle'); // 'idle', 'spinning', 'stopping'
  const [pendingReward, setPendingReward] = useState(null);
  const [detailCrateContent, setDetailCrateContent] = useState(null);
  const [detailCrateLoading, setDetailCrateLoading] = useState(false);
  const [showBuyAnimation, setShowBuyAnimation] = useState(false);
  const audioRef = useRef(null);

  // Play sound when Crate Purchased overlay is shown
  useEffect(() => {
    if (showBuyAnimation) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    }
  }, [showBuyAnimation]);

  const playerId = "legendskiller"; // or get from user session

  // Add a function to refresh owned crates
  const refreshOwnedCrates = () => {
    setOwnedLoading(true);
    fetch("https://client.0xbg.games/GetOwnedCrates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
      },
      body: JSON.stringify({ player_id: playerId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data?.status && Array.isArray(data.crates)) {
          setOwnedCrates(data.crates);
        } else {
          setOwnedCrates([]);
        }
      })
      .catch(() => setOwnedCrates([]))
      .finally(() => setOwnedLoading(false));
  };

  // Handler for showing buy animation
  const handleBuySuccessAnimation = () => {
    setShowBuyAnimation(true);
    setTimeout(() => {
      setShowBuyAnimation(false);
      refreshOwnedCrates();
    }, 125000);
  };

  // Fetch owned crates on mount or when returning to owned view
  useEffect(() => {
    if (currentView === 'owned') {
      refreshOwnedCrates();
    }
  }, [currentView]);

  const handleViewCrate = async (crate: any) => {
    setSelectedCrate(crate);
    setDetailCrateContent(null);
    setDetailCrateLoading(true);
    setCurrentView('detail');
    try {
      const response = await fetch("https://client.0xbg.games/GetCrateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({ player_id: playerId, guid: crate.guid }),
      });
      const data = await response.json();
      if (data?.status && data?.content) {
        setDetailCrateContent(data.content);
      } else {
        setDetailCrateContent(crate.content || []);
      }
    } catch (err) {
      setDetailCrateContent(crate.content || []);
    } finally {
      setDetailCrateLoading(false);
    }
  };

  const handleBuyCrate = () => {
    setCurrentView('store');
  };

  // Helper to get crate image
  const getCrateImage = (crateName: string) => {
    if (crateName.toLowerCase().includes('hostile')) return hostileLegacyBoxImg;
    if (crateName.toLowerCase().includes('vanity')) return vanityCrateImg;
    return hostileLegacyBoxImg; // fallback
  };

  // Open button: fetch crate content and show modal
  const handleOpenOwnedCrate = async (crate: any) => {
    setSelectedCrate(crate);
    setOpenedCrateGuid(crate.guid);
    setOpenedCrateContent(null);
    setSpinReward(null);
    setSpinningOwned(false);
    setModalOpen(true);
    // Fetch crate content
    try {
      const response = await fetch("https://client.0xbg.games/GetCrateContent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        },
        body: JSON.stringify({ player_id: playerId, guid: crate.guid }),
      });
      const data = await response.json();
      if (data?.status && data?.content) {
        setOpenedCrateContent(data.content);
      } else {
        setOpenedCrateContent([]);
      }
    } catch (err) {
      setOpenedCrateContent([]);
    }
  };

  // Prepare carousel items when crate content is loaded and modal opens
  useEffect(() => {
    if (modalOpen && openedCrateContent && openedCrateContent.length > 0) {
      // Duplicate the content to fill at least 20 items
      let repeated = [];
      while (repeated.length < 20) {
        repeated = repeated.concat(openedCrateContent);
      }
      setCarouselItems(repeated.slice(0, 20));
      setWinnerIndex(null);
      setWinningTag(null);
    }
  }, [modalOpen, openedCrateContent]);

  // SPIN logic
  const handleSpinOwnedCrate = async (crate: any) => {
    setSpinPhase('spinning'); // Start animation immediately
    setSpinningOwned(true);
    setSpinReward(null);
    setWinnerIndex(null);
    setWinningTag(null);
    setPendingReward(null);

    let rewardObj = null;
    let rewardTag = null;
    let apiError = false;

    const apiPromise = fetch("https://client.0xbg.games/OpenCrate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken") || "",
      },
      body: JSON.stringify({
        player_id: playerId,
        guid: crate.guid,
      }),
    })
      .then(res => res.json())
      .then(data => {
        rewardObj = (data?.data?.content) || (data?.reward);
        if (data?.status && rewardObj) {
          rewardTag = rewardObj.tag;
          setPendingReward(rewardObj);
        } else {
          apiError = true;
        }
      })
      .catch(() => { apiError = true; });

    await apiPromise;

    if (apiError || !rewardObj) {
      rewardObj = {
        tag: "inventory.weapon.revolver",
        rarity: 5,
        type: "Weapon",
        chance: 1,
        material_id: "fallback-revolver"
      };
      rewardTag = "inventory.weapon.revolver";
      setPendingReward(rewardObj);
    }

    setSpinReward(rewardObj);
    setWinningTag(rewardTag);
    setSpinPhase('stopping');

    setTimeout(() => {
      if (carouselItems && rewardTag) {
        const idx = carouselItems.map(i => i.tag).lastIndexOf(rewardTag);
        setWinnerIndex(idx);
      }
      setSpinningOwned(false);
      setSpinPhase('idle');
      refreshOwnedCrates(); // Refresh after opening
    }, 2000);
  };

  const handleBackToStore = () => {
    setCurrentView('store');
    setSelectedCrate(null);
    setSpinning(false);
    setReward(null);
    setCrateContent(null);
  };

  const handleSpinnerComplete = () => {
    setSpinning(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="min-h-screen bg-zinc-900 text-white p-16">
        {/* Top bar with Buy Crates button */}
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
                {ownedCrates.map((crate: any) => (
                  <div key={crate.guid} className="bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition-transform border border-gray-700">
                    <img src={getCrateImage(crate.crate_name)} alt="Crate" className="w-30 h-30 mb-4 rounded-lg shadow" />
                    <span className="bg-blue-700 text-xs px-3 py-1 rounded-full mb-2">{crate.crate_name.replaceAll('"', '')}</span>
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

        {/* Crate Detail View (from store) */}
        {currentView === 'detail' && selectedCrate && (
          detailCrateLoading ? (
            <div className="text-center text-lg text-gray-300 py-12">Loading crate details...</div>
          ) : (
            <CrateDetail 
              crate={{ ...selectedCrate, content: detailCrateContent || selectedCrate.content }} 
              playerId={playerId}
              onBack={() => setCurrentView('store')}
              onBuyCrate={handleBuyCrate}
            />
          )
        )}

        {/* Spinner View for opening owned crate */}
        {currentView === 'spinner' && selectedCrate && (
          <div>
            <button
              onClick={() => setCurrentView('owned')}
              className="mb-4 px-4 py-2 bg-red-600 rounded"
            >
              ← Back to My Crates
            </button>
            <h1 className="text-4xl mb-6">🎁 Opening Your Crate</h1>
            {/* You may want to fetch and show crate content here if needed */}
            <CrateSpinner
              content={crateContent || []}
              spinning={spinning}
              reward={reward}
              onComplete={() => setSpinning(false)}
              spinPhase={spinPhase}
              pendingReward={pendingReward}
            />
            <div className="mt-6 text-center">
              <button
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                onClick={async () => {
                  if (!spinning) {
                    setSpinning(true);
                    // Call OpenCrate API for this crate
                    try {
                      const response = await fetch("https://client.0xbg.games/OpenCrate", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: localStorage.getItem("accessToken") || "",
                        },
                        body: JSON.stringify({
                          player_id: playerId,
                          guid: selectedCrate.guid,
                        }),
                      });
                      const data = await response.json();
                      if (data?.status && data?.data?.content) {
                        setReward(data.data.content);
                        
                      } else {
                        throw new Error("No reward returned");
                      }
                    } catch (err) {
                      console.error("Error opening crate", err);
                      setReward({
                        tag: "inventory.weapon.revolver",
                        rarity: 5,
                        type: "Weapon",
                        chance: 1,
                        material_id: "fallback-revolver"
                      });
                      alert("Could not open crates from server. Showing fallback reward.");
                    }
                  }
                }}
                disabled={spinning}
              >
                {spinning ? "Opening..." : "Open Crate"}
              </button>
            </div>
            {reward && (
              <div className="mt-6 text-2xl text-green-400 text-center">
                🎉 You got: {reward.tag}
              </div>
            )}
          </div>
        )}
      </div>
      {/* Overlay for crate buy animation */}
      {showBuyAnimation && (
        <>
          <audio ref={audioRef} src="/sounds/crate_open.mp3" />
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
            <div className="flex flex-col items-center justify-center w-full h-full">
              <img
                src={lootCrateOpeningAnimation}
                alt="Crate Opening Animation"
                style={{
                  width: '70vw',
                  maxWidth: '900px',
                  minWidth: '400px',
                  height: 'auto',
                  maxHeight: '95vh',
                  border: '6px solid #ffb504',
                  borderRadius: '0',
                  boxShadow: '0 0 64px #ffb504, 0 0 128px #000',
                }}
                className="mx-auto"
              />
              <div className="mt-10 text-6xl font-extrabold text-center" style={{ color: '#ffb504', textShadow: '0 0 24px #000, 0 0 48px #ffb504' }}>
                Crate Purchased!
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}