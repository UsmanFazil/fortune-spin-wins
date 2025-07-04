
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import Confetti from "./Confetti";

const SpinWheel = () => {
  const [items, setItems] = useState([
    "Pizza Party", "Movie Night", "Ice Cream", "Game Time", 
    "Book Store", "Park Visit", "Art Supplies", "Music Concert"
  ]);
  const [newItem, setNewItem] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", 
    "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
    "#BB8FCE", "#85C1E9", "#F8C471", "#82E0AA"
  ];

  const addItem = () => {
    if (newItem.trim() && items.length < 12) {
      setItems([...items, newItem.trim()]);
      setNewItem("");
      toast.success("Item added to the wheel!");
    } else if (items.length >= 12) {
      toast.error("Maximum 12 items allowed!");
    }
  };

  const removeItem = (index: number) => {
    if (items.length > 2) {
      setItems(items.filter((_, i) => i !== index));
      toast.success("Item removed!");
    } else {
      toast.error("Need at least 2 items to spin!");
    }
  };

  const spinWheel = () => {
    if (isSpinning || items.length < 2) return;
    
    setIsSpinning(true);
    setWinner(null);
    setShowConfetti(false);
    
    // Random spin between 5-8 full rotations plus random angle
    const spins = 5 + Math.random() * 3;
    const finalAngle = Math.random() * 360;
    const totalRotation = spins * 360 + finalAngle;
    
    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${totalRotation}deg)`;
    }
    
    // Calculate winner based on final position
    setTimeout(() => {
      const segmentAngle = 360 / items.length;
      const normalizedAngle = (360 - (finalAngle % 360)) % 360;
      const winnerIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedItem = items[winnerIndex];
      
      setWinner(selectedItem);
      setIsSpinning(false);
      setShowConfetti(true);
      
      toast.success(`🎉 Congratulations! You won: ${selectedItem}!`);
      
      // Hide confetti after 3 seconds
      setTimeout(() => setShowConfetti(false), 3000);
    }, 3000);
  };

  const resetWheel = () => {
    if (wheelRef.current) {
      wheelRef.current.style.transform = "rotate(0deg)";
    }
    setWinner(null);
    setShowConfetti(false);
    setIsSpinning(false);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {showConfetti && <Confetti />}
      
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Wheel Section */}
        <div className="flex flex-col items-center">
          <div className="relative">
            {/* Wheel Container */}
            <div className="relative w-80 h-80 rounded-full shadow-2xl overflow-hidden border-8 border-white">
              <div
                ref={wheelRef}
                className="w-full h-full transition-transform duration-[3000ms] ease-out"
                style={{ transformOrigin: "center center" }}
              >
                <svg width="320" height="320" className="w-full h-full">
                  {items.map((item, index) => {
                    const angle = (360 / items.length) * index;
                    const nextAngle = (360 / items.length) * (index + 1);
                    const midAngle = (angle + nextAngle) / 2;
                    
                    const x1 = 160 + 150 * Math.cos((angle * Math.PI) / 180);
                    const y1 = 160 + 150 * Math.sin((angle * Math.PI) / 180);
                    const x2 = 160 + 150 * Math.cos((nextAngle * Math.PI) / 180);
                    const y2 = 160 + 150 * Math.sin((nextAngle * Math.PI) / 180);
                    
                    const textX = 160 + 100 * Math.cos((midAngle * Math.PI) / 180);
                    const textY = 160 + 100 * Math.sin((midAngle * Math.PI) / 180);
                    
                    return (
                      <g key={index}>
                        <path
                          d={`M 160 160 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`}
                          fill={colors[index % colors.length]}
                          stroke="white"
                          strokeWidth="2"
                        />
                        <text
                          x={textX}
                          y={textY}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          transform={`rotate(${midAngle}, ${textX}, ${textY})`}
                          className="drop-shadow-lg"
                        >
                          {item.length > 10 ? item.substring(0, 10) + "..." : item}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            
            {/* Pointer */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[40px] border-l-transparent border-r-transparent border-b-yellow-400 drop-shadow-lg"></div>
            </div>
            
            {/* Center Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <Button
                onClick={spinWheel}
                disabled={isSpinning || items.length < 2}
                className="w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold text-lg shadow-lg border-4 border-white"
              >
                {isSpinning ? "..." : "SPIN"}
              </Button>
            </div>
          </div>
          
          {/* Reset Button */}
          <Button
            onClick={resetWheel}
            variant="outline"
            className="mt-4 bg-white/90 hover:bg-white"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        {/* Controls Section */}
        <div className="space-y-6">
          {/* Winner Display */}
          {winner && (
            <Card className="p-6 bg-gradient-to-r from-yellow-400 to-orange-500 border-0 shadow-xl">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-2">🎉 CONGRATULATIONS! 🎉</h2>
                <p className="text-xl text-white font-semibold">You won: {winner}!</p>
              </div>
            </Card>
          )}
          
          {/* Add Item */}
          <Card className="p-6 bg-white/90 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4">Add New Item</h3>
            <div className="flex gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Enter item name..."
                onKeyPress={(e) => e.key === "Enter" && addItem()}
                maxLength={20}
              />
              <Button onClick={addItem} disabled={!newItem.trim() || items.length >= 12}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              {items.length}/12 items • Need at least 2 items to spin
            </p>
          </Card>
          
          {/* Items List */}
          <Card className="p-6 bg-white/90 backdrop-blur">
            <h3 className="text-lg font-semibold mb-4">Wheel Items</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-white/50"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    ></div>
                    <span className="font-medium">{item}</span>
                  </div>
                  <Button
                    onClick={() => removeItem(index)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={items.length <= 2}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SpinWheel;
