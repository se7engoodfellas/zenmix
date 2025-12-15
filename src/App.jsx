import { useEffect, useState } from "react";
import SoundCard from "./components/SoundCard";
import PresetSelector from "./components/PresetSelector";
import { useSounds } from "./hooks/useSounds";
import { useActiveSounds } from "./hooks/useActiveSounds";

function App() {
  const { sounds } = useSounds();

  // STATE: holds play status and volume for each sound
  // Format: { "rain": { isPlaying: false, volume: 0.5 }, "fire": ... }
  const [soundStates, setSoundStates] = useState({});
  
  const {
    activeSounds,
    setActiveSounds,
    toggleActiveSound,
    toggleActiveSoundAll,
  } = useActiveSounds(setSoundStates);

  // Helper to get a sound's state (or defaults if missing)
  const getSoundState = (id) =>
    soundStates[id] || { isPlaying: false, volume: 0.5 };

  // 1. Toggle Play/Pause
  const toggleSound = (id) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };
      
       // Active sounds are added/removed on mouse click
      toggleActiveSound(id, !current.isPlaying)

      return {
        ...prev,
        [id]: { ...current, isPlaying: !current.isPlaying },
      }
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

    // Build a new active sounds state array from the preset
    let activePreset = []

    // Start with defaults for every sound
    sounds.forEach((sound) => {
      newStates[sound.id] = { isPlaying: false, volume: 0.5 };
    });

    // Set empty active sounds before applying preset
    setActiveSounds([])

    // Then enable only the sounds defined in the preset
    Object.keys(preset.mix).forEach((soundId) => {
      if (newStates[soundId]) {
        // Αν υπάρχει ο ήχος στο σύστημα
        newStates[soundId] = {
          isPlaying: true,
          volume: preset.mix[soundId],
        };

        // Adds preset item to activePreset array
        activePreset.push(soundId)
        // Play active sounds on preset select
        toggleActiveSound(soundId, true)
      }
    });

    setActiveSounds(activePreset)
    setSoundStates(newStates);
  };

  // Event listener for toggling all active sounds
  useEffect(() => {
    const handleToggleActive = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (activeSounds.length > 0) {
          toggleActiveSoundAll();
        }
      }
    };

    window.addEventListener("keydown", handleToggleActive);
    return () => window.removeEventListener("keydown", handleToggleActive);
  }, [activeSounds, toggleActiveSoundAll]);


  return (
    <div className="min-h-screen bg-gray-900 text-white p-10 font-sans">
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-blue-100">
          ZenMix
        </h1>
        <p className="text-gray-400">Mix your perfect soundscape.</p>
      </header>

      {/* Preset Selector */}
      <PresetSelector setActiveSounds={setActiveSounds} onSelectPreset={handleSelectPreset} />

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
            />
          );
        })}
      </main>
    </div>
  );
}

export default App;