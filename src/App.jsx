import { useState } from "react";
import SoundCard from "./components/SoundCard";
import PresetSelector from "./components/PresetSelector";
import { useSounds } from "./hooks/useSounds";
import { Volume2, VolumeX } from "lucide-react";

function App() {
  const { sounds } = useSounds();
  const [isMuted, setIsMuted] = useState(false);
  // STATE: holds play status and volume for each sound
  // Format: { "rain": { isPlaying: false, volume: 0.5 }, "fire": ... }
  const [soundStates, setSoundStates] = useState({});

  // Helper to get a sound's state (or defaults if missing)
  const getSoundState = (id) =>
    soundStates[id] || { isPlaying: false, volume: 0.5 };

  // 1. Toggle Play/Pause
  const toggleSound = (id) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      return {
        ...prev,
        [id]: { ...current, isPlaying: !current.isPlaying },
      };
    });
  };

  // 2. Change Volume
  const changeVolume = (id, newVolume) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      return {
        ...prev,
        [id]: { ...current, volume: newVolume },
      };
    });
  };

  // 3. Load Preset Logic
  const handleSelectPreset = (preset) => {
    if (!preset) {
      // If null (reset), clear all
      setSoundStates({});
      return;
    }

    // Build a new state object from the preset
    const newStates = {};

    // Start with defaults for every sound
    sounds.forEach((sound) => {
      newStates[sound.id] = { isPlaying: false, volume: 0.5 };
    });

    // Then enable only the sounds defined in the preset
    Object.keys(preset.mix).forEach((soundId) => {
      if (newStates[soundId]) {
        // Αν υπάρχει ο ήχος στο σύστημα
        newStates[soundId] = {
          isPlaying: true,
          volume: preset.mix[soundId],
        };
      }
    });

    setSoundStates(newStates);
  };
  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };
  
  const MuteIcon = isMuted ? VolumeX : Volume2;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <header className="mb-10 relative flex justify-center items-center max-w-5xl mx-auto">
        <div>
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-blue-100">
          ZenMix
        </h1>
        <p className="text-gray-400">Mix your perfect soundscape.</p>
        </div>
        <button
          onClick={toggleMute}
          className={`absolute right-0 p-3 rounded-full transition-colors duration-300 ${
            isMuted ? "bg-red-600 hover:bg-red-700" : "bg-white/10 hover:bg-white/20"
          }`}
          aria-label={isMuted ? "Unmute all sounds" : "Mute all sounds"}
        >
          <MuteIcon size={24} className="text-white" />
        </button>
      </header>

      {/* Preset Selector */}
      <PresetSelector onSelectPreset={handleSelectPreset} />

      {/* Grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sounds.map((sound) => {
          const state = getSoundState(sound.id);
          return (
            <SoundCard
              key={sound.id}
              sound={sound}
              // pass state and controls to child
              isPlaying={state.isPlaying}
              volume={state.volume}
              onToggle={toggleSound}
              onVolumeChange={changeVolume}
              isGloballyMuted={isMuted}
            />
          );
        })}
      </main>
    </div>
  );
}

export default App;
