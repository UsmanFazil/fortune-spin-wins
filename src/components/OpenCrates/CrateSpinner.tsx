import React, { useEffect, useRef, useState } from "react";

const CARD_WIDTH = 240 + 16; // width + margin

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
  const [internalSpin, setInternalSpin] = useState(false);
  const [stopIndex, setStopIndex] = useState<number | null>(null);
  const animationRef = useRef<number>();
  
  const repeatedContent = Array(10).fill(content).flat();
  const rewardIndex = reward ? repeatedContent.findIndex(
    (item) => item.material_id === reward?.material_id
  ) : -1;

  // Phase 1: Fast spinning
  useEffect(() => {
    if (spinPhase === 'spinning') {
      setInternalSpin(true);
      setStopIndex(null);
      let offset = 0;
      let speed = 60; // px per frame, fast
      let lastTime = performance.now();
      
      const animate = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;
        offset += speed * (delta / 16); // normalize to 60fps
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

  // Phase 2: Decelerate and stop on reward
  useEffect(() => {
    if (spinPhase === 'stopping' && reward && rewardIndex !== -1) {
      setInternalSpin(true);
      // Calculate where to stop
      const totalCycles = 8;
      const finalIndex = totalCycles * content.length + (rewardIndex % content.length);
      const totalOffset = finalIndex * CARD_WIDTH;
      const centerOffset = totalOffset - (typeof window !== 'undefined' ? window.innerWidth / 2 : 800) + CARD_WIDTH / 2;
      const startOffset = currentOffset;
      const distance = centerOffset - startOffset;
      const duration = 2000;
      const startTime = performance.now();
      
      const animate = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const offset = startOffset + distance * easeOut;
        setCurrentOffset(offset);
        if (containerRef.current) {
          containerRef.current.style.transform = `translateX(-${offset}px)`;
        }
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setInternalSpin(false);
          setStopIndex(rewardIndex);
          onComplete?.();
        }
      };
      animationRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [spinPhase, reward, rewardIndex, content.length, currentOffset, onComplete]);

  // Reset offset when not spinning
  useEffect(() => {
    if (spinPhase === 'idle') {
      setCurrentOffset(0);
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
    <div className="relative w-full overflow-hidden border-2 border-gray-700 rounded-lg bg-gray-900">
      {/* Center indicator */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white bg-opacity-70 shadow-lg z-10 pointer-events-none rounded"></div>
      <div
        ref={containerRef}
        className="flex transition-transform ease-out"
        style={{ willChange: "transform" }}
      >
        {repeatedContent.map((item, idx) => (
          <div key={idx} className={`w-60 mx-2 flex-shrink-0 p-2 ${stopIndex === idx ? 'border-4 border-green-400' : ''}`}>
            <div className={`border-2 rounded-lg p-4 h-full ${getRarityColor(item.rarity)}`}>
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-gray-800 rounded-lg flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=96&h=96&fit=crop"
                    alt="Weapon" 
                    className="w-24 h-24 object-contain"
                  />
                </div>
                <div className={`font-bold text-sm ${getRarityColor(item.rarity).replace('border-', 'text-').replace('/20', '')}`}>
                  {getRarityName(item.rarity)}
                </div>
                <div className="text-xs text-gray-300 mt-1">
                  {item.tag.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {item.type}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrateSpinner;