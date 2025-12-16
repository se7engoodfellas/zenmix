import { useEffect, useState } from "react";
import SoundCard from "./components/SoundCard";
import PresetSelector from "./components/PresetSelector";
import { useSounds } from "./hooks/useSounds";
import { useActiveSounds } from "./hooks/useActiveSounds";
import { useTheme } from "./context/ThemeContext";
import { Sun, Moon } from "lucide-react";

function App() {
  const { sounds } = useSounds();
  const { theme, toggleTheme } = useTheme();

  // STATE: holds play status and volume for each sound
  // Format: { "rain": { isPlaying: false, volume: 0.5 }, "fire": ... }
  const [soundStates, setSoundStates] = useState({});
  
  const {
    activeSounds,
    setActiveSounds,
    toggleActiveSound,
    toggleActiveSoundAll,
  } = useActiveSounds(setSoundStates);

  // STATE: holds value in the search Bar
  const [search, setSearch] = useState('')
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
    // LIGHT DEFAULT: bg-gray-50, text-gray-900 (Base Class)
    // DARK OVERRIDE: dark:bg-gray-900, dark:text-white (dark: prefix)
    <div className="min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white p-3 sm:p-5 md:p-10 font-sans">
      
      <header className="mb-10 flex flex-col items-center relative">
        <div className="text-center">
          {/* Light: text-blue-600. Dark: dark:text-blue-100 */}
          <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight text-blue-600 dark:text-blue-100">
            ZenMix
          </h1>
          {/* Light: text-gray-500. Dark: dark:text-gray-400 */}
          <p className="text-gray-500 dark:text-gray-400">Mix your perfect soundscape.</p>
        </div>
        
        {/* Theme Toggle Button */}
        <button 
          onClick={toggleTheme}
          // Light default: bg-gray-200. Dark override: dark:bg-gray-800
          className="absolute right-0 top-0 p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle Theme"
        >
          {/* Display Sun when currently Dark. Display Moon when currently Light. */}
          {theme === 'dark' 
            ? <Sun size={20} className="text-yellow-500" /> 
            : <Moon size={20} className="text-gray-700" />}
        </button>
      </header>

      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          placeholder="🔍 Search for sounds"
          // Light default: bg-white, text-gray-800
          // Dark override: dark:bg-white/10, dark:text-white
          className="bg-white text-gray-800 dark:bg-white/10 dark:text-white border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-white/20 rounded-2xl text-center w-2/5 h-10 mb-10 transition-colors placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4"
          onChange={(e) => {setSearch(e.target.value)}}
        />
      </div>

      {/* Preset Selector */}
      <PresetSelector setActiveSounds={setActiveSounds} onSelectPreset={handleSelectPreset} />

      {/* Grid */}
      <main className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
        {sounds.map((sound) => {
          const state = getSoundState(sound.id);
          if(sound.label.toLowerCase().includes(search.toLowerCase())){
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
          }
        })}
      </main>
    </div>
  );
}

export default App;