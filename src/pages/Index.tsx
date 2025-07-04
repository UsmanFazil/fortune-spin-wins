
import SpinWheel from "@/components/SpinWheel";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎡 Spin the Wheel! 🎡
          </h1>
          <p className="text-xl text-white/90 drop-shadow">
            Add your items and spin to win!
          </p>
        </div>
        <SpinWheel />
      </div>
    </div>
  );
};

export default Index;
