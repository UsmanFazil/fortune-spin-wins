
import React, { useEffect, useRef, useState } from "react";

const CARD_WIDTH = 200; // Large casino-style cards
const CARD_MARGIN = 20; // More spacing between cards
const TOTAL_CARD_WIDTH = CARD_WIDTH + CARD_MARGIN * 2;
const VISIBLE_CARDS = 3; // Only show 3 cards like casino games

interface CrateItem {
  tag: string;
  rarity: number;
  type: string;
  material_id?: string;
  image?: string;
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
  // Use more repetitions to ensure we never run out of content
  const repeatedContent = Array(50).fill(content).flat();
  
  // Find a random reward position in the later cycles to ensure long spin
  const getRandomRewardPosition = () => {
    if (!reward) return -1;
    const minCycles = 15; // Minimum cycles before it can stop
    const maxCycles = 18; // Maximum cycles
    const randomCycle = Math.floor(Math.random() * (maxCycles - minCycles + 1)) + minCycles;
    const rewardInCycle = content.findIndex(item => item.material_id === reward.material_id);
    if (rewardInCycle === -1) return randomCycle * content.length; // If not found, use first item
    return randomCycle * content.length + rewardInCycle;
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
        
        // Reset offset when it gets too large to prevent running out of content
        const maxOffset = repeatedContent.length * TOTAL_CARD_WIDTH;
        if (offset > maxOffset * 0.8) {
          offset = offset % (content.length * TOTAL_CARD_WIDTH);
        }
        
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
  }, [spinPhase, content.length, repeatedContent.length]);

  // Deceleration and stopping animation
  useEffect(() => {
    if (spinPhase === 'stopping' && reward) {
      const targetIndex = getRandomRewardPosition();
      if (targetIndex === -1) return;
      
      // Calculate precise center position for the winning card
      const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
      const centerPosition = containerWidth / 2;
      // Position the card so its center aligns with screen center
      const targetOffset = (targetIndex * TOTAL_CARD_WIDTH) + (TOTAL_CARD_WIDTH / 2) - centerPosition;
      
      const startOffset = currentOffset;
      const distance = targetOffset - startOffset;
      const duration = 2000; // Shorter duration for snappier feel
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Use exponential easing that decelerates smoothly without overshooting
        // This creates a more natural deceleration like real slot machines
        const easeOut = 1 - Math.exp(-5 * progress);
        
        const offset = startOffset + distance * easeOut;
        setCurrentOffset(offset);
        
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(-${offset}px)`;
        }
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Ensure final position is perfectly aligned
          const finalOffset = targetOffset;
          setCurrentOffset(finalOffset);
          if (containerRef.current) {
            containerRef.current.style.transform = `translateX(-${finalOffset}px)`;
          }
          setWinningIndex(targetIndex);
          setTimeout(() => onComplete?.(), 200);
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
      // Reset to a position that shows the first few items
      const resetOffset = 0;
      setCurrentOffset(resetOffset);
      setWinningIndex(null);
      if (containerRef.current) {
        containerRef.current.style.transform = `translateX(-${resetOffset}px)`;
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

  // Calculate which card is in the center
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const centerOffset = containerWidth / 2;
  const centerCardIndex = Math.round((currentOffset + centerOffset) / TOTAL_CARD_WIDTH);

  return (
    <div className="relative w-full h-64 overflow-hidden bg-gradient-to-b from-gray-900 to-black rounded-xl shadow-2xl">
      {/* Casino-style frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 pointer-events-none"></div>
      
      {/* Spinning items container */}
      <div
        ref={containerRef}
        className="flex h-full items-center justify-center"
        style={{ willChange: "transform" }}
      >
        {repeatedContent.map((item, idx) => {
          const isWinning = winningIndex === idx && spinPhase === 'idle';
          const isCenterCard = Math.abs(centerCardIndex - idx) === 0 && spinPhase !== 'idle';
          
          return (
            <div 
              key={`${item.material_id || item.tag}-${idx}`} 
              className={`flex-shrink-0 h-56 transition-all duration-500 ${
                isWinning ? 'scale-110 drop-shadow-2xl' : isCenterCard ? 'scale-105' : ''
              }`}
              style={{ 
                width: `${CARD_WIDTH}px`,
                margin: `0 ${CARD_MARGIN}px`
              }}
            >
              <div className={`
                relative h-full rounded-xl p-4 border-3 transition-all duration-500 ${getRarityColor(item.rarity)}
                ${isWinning ? 'border-yellow-400 bg-yellow-900/40 shadow-yellow-400/50 shadow-2xl animate-pulse ring-4 ring-yellow-400/50' : ''}
                ${isCenterCard ? 'border-white/50 bg-white/5 shadow-lg' : ''}
              `}>
                {/* Winning glow effect */}
                {isWinning && (
                  <div className="absolute inset-0 bg-yellow-400/20 rounded-xl animate-pulse"></div>
                )}
                
                {/* Center card highlight */}
                {isCenterCard && (
                  <div className="absolute inset-0 bg-white/10 rounded-xl"></div>
                )}
                
                <div className="relative text-center h-full flex flex-col justify-center">
                  <div className="w-32 h-32 mx-auto mb-3 bg-gray-800/80 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    {item.image ? (
                      <img 
                        src={item.image}
                        alt="Weapon" 
                        className="w-28 h-28 object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=112&h=112&fit=crop";
                        }}
                      />
                    ) : (
                      <img 
                        src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=112&h=112&fit=crop"
                        alt="Weapon" 
                        className="w-28 h-28 object-contain"
                      />
                    )}
                  </div>
                  <div className={`font-bold text-sm mb-1 ${getRarityColor(item.rarity).replace('border-', 'text-').replace('bg-', '').replace('/20', '')}`}>
                    {getRarityName(item.rarity)}
                  </div>
                  <div className="text-sm text-gray-300 truncate px-2 font-medium">
                    {item.tag.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Side fade effects for casino feel */}
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-gray-900 via-gray-900/80 to-transparent pointer-events-none z-10"></div>
    </div>
  );
};

export default CrateSpinner;
