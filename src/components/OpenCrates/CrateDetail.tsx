import React, { useState } from "react";

const fallbackImg = "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=96&h=96&fit=crop";

export const weaponImages: Record<string, string> = {
  revolver: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=96&h=96&fit=crop",
  assaultrifle: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=96&h=96&fit=crop",
  shotgun: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=96&h=96&fit=crop",
  grenadelauncher: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop",
  smguzi: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=crop",
  rocketlauncher: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=96&h=96&fit=crop",
  sniperrifledmr: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=96&h=96&fit=crop",
  sniperrifle: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=96&h=96&fit=crop",
  sniper: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=96&h=96&fit=crop",
  sniper2: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=96&h=96&fit=crop",
  machinegun: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=96&h=96&fit=crop",
  machinegun2: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=96&h=96&fit=crop",
  assaultriflem14: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=96&h=96&fit=crop",
  mp5x: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=96&h=96&fit=crop"
};

interface WeaponImageProps {
  src: string;
  alt: string;
}

const WeaponImage: React.FC<WeaponImageProps> = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  return (
    <img
      src={imgSrc}
      alt={alt}
      className="object-contain w-20 h-20"
      onError={() => setImgSrc(fallbackImg)}
    />
  );
};

const getWeaponImagePath = (tag: string) => {
  if (!tag) return fallbackImg;
  const match = tag.match(/^inventory\.weapon\.(.+)$/);
  if (!match) return fallbackImg;
  const weaponName = match[1].replace(/\./g, "").replace(/_/g, "");
  return weaponImages[weaponName] || fallbackImg;
};

const categoryNames: Record<number, string> = {
  1: "Weapon",
  2: "Outfit", 
  3: "Protective Gear",
  4: "Vehicle",
  5: "Bundle",
  6: "Character",
  7: "Other"
};

interface CrateItem {
  tag: string;
  rarity: number;
  type: string;
  category: number;
  chance?: number;
}

interface Crate {
  guid: string;
  name: string;
  price: string;
  content?: CrateItem[];
}

interface CrateDetailProps {
  crate: Crate;
  playerId: string;
  onBack: () => void;
  onBuyCrate: () => void;
}

const CrateDetail: React.FC<CrateDetailProps> = ({ crate, playerId, onBack, onBuyCrate }) => {
  const getRarityColor = (rarity: number) => {
    switch (rarity) {
      case 1: return "text-yellow-400";
      case 2: return "text-purple-400";
      case 3: return "text-blue-400";
      case 4: return "text-green-400";
      case 5: return "text-gray-400";
      default: return "text-gray-400";
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

  // Mock content if none provided
  const mockContent: CrateItem[] = [
    { tag: "inventory.weapon.revolver", rarity: 5, type: "Weapon", category: 1, chance: 0.3 },
    { tag: "inventory.weapon.assaultrifle", rarity: 4, type: "Weapon", category: 1, chance: 0.25 },
    { tag: "inventory.weapon.shotgun", rarity: 3, type: "Weapon", category: 1, chance: 0.2 },
    { tag: "inventory.weapon.sniperrifle", rarity: 2, type: "Weapon", category: 1, chance: 0.15 },
    { tag: "inventory.weapon.rocketlauncher", rarity: 1, type: "Weapon", category: 1, chance: 0.1 }
  ];

  const content = crate.content || mockContent;

  return (
    <div className="bg-zinc-900 text-white py-6 px-4 w-full">
      <button 
        onClick={onBack} 
        className="mb-4 px-4 py-2 bg-gray-600 rounded hover:bg-gray-700 transition-colors"
      >
        ← Back to Store
      </button>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">{crate.name.replace(/"/g, '')}</h2>
        <p className="mb-6 text-lg">Price: {crate.price}</p>

        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Items in Crate:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {content.map((item, index) => (
              <div key={index} className="border border-gray-600 p-4 rounded-md bg-gray-800 flex flex-col items-center">
                <div className="w-24 h-24 mb-2 flex items-center justify-center bg-gray-900 rounded">
                  <WeaponImage src={getWeaponImagePath(item.tag)} alt="Weapon" />
                </div>
                <div className={`font-semibold ${getRarityColor(item.rarity)}`}>
                  {getRarityName(item.rarity)}
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  {item.tag.replace('inventory.weapon.', '').replace(/_/g, ' ')}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Type: {item.type}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Category: {categoryNames[item.category] || item.category}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Rarity: {getRarityName(item.rarity)} ({item.rarity})
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Chance: {item.chance !== undefined ? (item.chance * 100).toFixed(2) + '%' : 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrateDetail;