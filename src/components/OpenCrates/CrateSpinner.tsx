import React, { useEffect, useRef, useState } from "react";

const CARD_WIDTH = 160; // Reduced width for more items visible
const CARD_MARGIN = 8; // Margin between cards
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;

interface CrateItem {
  tag: string;
  rarity: number;
  type: string;
  material_id?: string;
}

interface CrateSpinnerProps {
  content: CrateItem[];
  reward?: CrateItem | null;
  spinning: boolean;
  onComplete?: () => void;
  spinPhase?: string;
  pendingReward?: CrateItem | null;
}

const CrateSpinner: React.FC<CrateSpinnerProps> = ({ 
  content, 
  reward, 
  spinning, 
  onComplete, 
  spinPhase = 'idle', 
  pendingReward = null 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [winningIndex, setWinningIndex] = useState<number | null>(null);
  const animationRef = useRef<number>();
  
  // Create many repeated items for smooth infinite scroll effect
  const repeatedContent = Array(20).fill(content).flat(); // More repetitions for longer spin
  
  // Find a random reward position in the later cycles to ensure long spin
  const getRandomRewardPosition = () => {
    if (!reward) return -1;
    const minCycles = 15; // Minimum cycles before it can stop
    const maxCycles = 18; // Maximum cycles
    const randomCycle = Math.floor(Math.random() * (maxCycles - minCycles + 1)) + minCycles;
    const rewardInCycle = repeatedContent.findIndex(item => item.material_id === reward.material_id);
    return randomCycle * content.length + (rewardInCycle % content.length);
  };

  // Main spinning animation
  useEffect(() => {
    if (spinPhase === 'spinning') {
      setWinningIndex(null);
      let offset = 0;
      let velocity = 0;
      const maxSpeed = 25; // Reduced for smoother animation
      const acceleration = 1.2;
      let lastTime = performance.now();
      
      const animate = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;
        
        // Accelerate to max speed
        if (velocity < maxSpeed) {
          velocity += acceleration * (delta / 16);
        }
        
        offset += velocity * (delta / 16);
        setCurrentOffset(offset);
        
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(-${offset}px)`;
        }
        
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

  // Deceleration and stopping animation
  useEffect(() => {
    if (spinPhase === 'stopping' && reward) {
      const targetIndex = getRandomRewardPosition();
      if (targetIndex === -1) return;
      
      const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const centerOffset = containerWidth / 2 - TOTAL_CARD_WIDTH / 2;
      const targetOffset = targetIndex * TOTAL_CARD_WIDTH - centerOffset;
      
      const startOffset = currentOffset;
      const distance = targetOffset - startOffset;
      const duration = 3000; // 3 seconds for dramatic slow-down
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth deceleration with bounce at the end
        const easeOut = progress < 0.9 
          ? 1 - Math.pow(1 - progress, 4) // Strong ease out
          : 1 - Math.pow(1 - progress, 2) + Math.sin(progress * Math.PI * 8) * 0.01; // Slight bounce
        
        const offset = startOffset + distance * easeOut;
        setCurrentOffset(offset);
        
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(-${offset}px)`;
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setWinningIndex(targetIndex);
          // Add a small delay before calling onComplete for dramatic effect
          setTimeout(() => onComplete?.(), 500);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [spinPhase, reward, currentOffset, onComplete, content.length]);

  // Reset when idle
  useEffect(() => {
    if (spinPhase === 'idle') {
      setCurrentOffset(0);
      setWinningIndex(null);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(0px)`;
      }
    }
  }, [spinPhase]);

  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1: return "border-yellow-400 bg-yellow-900/20";
      case 2: return "border-purple-400 bg-purple-900/20";
      case 3: return "border-blue-400 bg-blue-900/20";
      case 4: return "border-green-400 bg-green-900/20";
      case 5: return "border-gray-400 bg-gray-900/20";
      default: return "border-gray-400 bg-gray-900/20";
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

  return (
    <div className="relative w-full h-48 overflow-hidden bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl border-4 border-yellow-500/50 shadow-2xl">
      {/* Slot machine style borders */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 pointer-events-none"></div>
      
      {/* Center winning indicator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-xl z-10 pointer-events-none">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg animate-pulse"></div>
      </div>
      
      {/* Spinning items container */}
      <div
        ref={containerRef}
        className="flex h-full items-center"
        style={{ willChange: "transform" }}
      >
        {repeatedContent.map((item, idx) => {
          const isWinning = winningIndex === idx && spinPhase === 'idle';
          return (
            <div 
              key={idx} 
              className={`flex-shrink-0 mx-2 h-40 transition-all duration-300 ${
                isWinning ? 'scale-110 drop-shadow-2xl' : ''
              }`}
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className={`
                relative h-full rounded-lg p-3 border-2 transition-all duration-300 ${getRarityColor(item.rarity)}
                ${isWinning ? 'border-yellow-400 bg-yellow-900/40 shadow-yellow-400/50 shadow-xl animate-pulse' : ''}
              `}>
                {/* Winning glow effect */}
                {isWinning && (
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-lg animate-pulse"></div>
                )}
                
                <div className="relative text-center h-full flex flex-col justify-center">
                  <div className="w-20 h-20 mx-auto mb-2 bg-gray-800/80 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    {item.image ? (
                      <img 
                        src={item.image}
                        alt="Weapon" 
                        className="w-16 h-16 object-contain"
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=64&h=64&fit=crop"
                        alt="Weapon" 
                        className="w-16 h-16 object-contain"
                      />
                    )}
                  </div>
                  <div className={`font-bold text-xs ${getRarityColor(item.rarity).replace('border-', 'text-').replace('bg-', '').replace('/20', '')}`}>
                    {getRarityName(item.rarity)}
                  </div>
                  <div className="text-xs text-gray-300 mt-1 truncate px-1">
                    {item.tag.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Side fade effects for slot machine feel */}
      <div className="absolute left-0 top-0 w-20 h-full bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-5"></div>
      <div className="absolute right-0 top-0 w-20 h-full bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-5"></div>
    </div>
  );
};

export default CrateSpinner;