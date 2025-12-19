import { useEffect, useState } from "react";
import SoundCard from "./components/SoundCard";
import PresetSelector from "./components/PresetSelector";
import { useSounds } from "./hooks/useSounds";
import { useActiveSounds } from "./hooks/useActiveSounds";
import { X, Play } from "lucide-react";
import { Volume2, VolumeX } from "lucide-react";

function App() {
  const { sounds } = useSounds();

  const [hasSaveData, setHasSaveData] = useState(false);

  const [hasResponded, setHasResponded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // STATE: holds play status and volume for each sound
  // Format: { "rain": { isPlaying: false, volume: 0.5 }, "fire": ... }
  const [soundStates, setSoundStates] = useState(() => {
    const saved = localStorage.getItem("zenmix-state");
    
    //modifies the saved object from localStorage  
    function modifyLastSave(){
      saved.includes("true") ? setHasSaveData(true) : setHasSaveData(false)
      const savedData = JSON.parse(saved)
      const keys = Object.keys(savedData)
      for (let i in keys){
        if(savedData[keys[i]].isPlaying){
          savedData[keys[i]].isPlaying = false
        }
        else{
          delete savedData[keys[i]]
        }
      }
      return savedData;
    }

    return saved ? modifyLastSave() : {};
  });

  useEffect(() => {
    localStorage.setItem("zenmix-state", JSON.stringify(soundStates));
  }, [soundStates]);

  const {
    activeSounds,
    setActiveSounds,
    toggleActiveSound,
    toggleActiveSoundAll,
  } = useActiveSounds(setSoundStates);

  // STATE: holds value in the search Bar
  const [search, setSearch] = useState("");
  // Helper to get a sound's state (or defaults if missing)
  const getSoundState = (id) =>
    soundStates[id] || { isPlaying: false, volume: 0.5 };

  // 1. Toggle Play/Pause
  const toggleSound = (id) => {
    setSoundStates((prev) => {
      const current = prev[id] || { isPlaying: false, volume: 0.5 };

      // Active sounds are added/removed on mouse click
      toggleActiveSound(id, !current.isPlaying);

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

    // Build a new active sounds state array from the preset
    let activePreset = [];

    // Start with defaults for every sound
    sounds.forEach((sound) => {
      newStates[sound.id] = { isPlaying: false, volume: 0.5 };
    });

    // Set empty active sounds before applying preset
    setActiveSounds([]);

    // Then enable only the sounds defined in the preset
    Object.keys(preset.mix).forEach((soundId) => {
      if (newStates[soundId]) {
        // Αν υπάρχει ο ήχος στο σύστημα
        newStates[soundId] = {
          isPlaying: true,
          volume: preset.mix[soundId],
        };

        // Adds preset item to activePreset array
        activePreset.push(soundId);
        // Play active sounds on preset select
        toggleActiveSound(soundId, true);
      }
    });

    setActiveSounds(activePreset);
    setSoundStates(newStates);
  };
  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const MuteIcon = isMuted ? VolumeX : Volume2;

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

  function handleResume(){
    setHasResponded(true)
    setSoundStates((prevStates) => {
      const updatedStates = { ...prevStates };
      Object.keys(updatedStates).forEach((key) => {
        updatedStates[key].isPlaying = true;
      });
      localStorage.setItem("zenmix-state", JSON.stringify(updatedStates));
      return updatedStates;
    });
  }

  return (
    <>
      {/* Banner For Saved Data */}
      {hasSaveData && !hasResponded && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-500">
          <div
            className="flex items-center gap-4 pl-6 pr-4 py-3 
      bg-gray-800/95 backdrop-blur-md 
      border border-blue-500/30 
      rounded-full shadow-[0_0_20px_-5px_rgba(59,130,246,0.3)] 
      ring-1 ring-white/10"
          >
            {/* Icon + Text Group */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400">
                <Play size={12} fill="currentColor" />
              </div>
              <span className="text-sm font-medium text-gray-100">
                Resume session?
              </span>
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-px bg-white/10" />

            {/* Resume Button */}
            <button
              onClick={handleResume}
              className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              Resume
            </button>

            {/* Close (X) Button */}
            <button
              onClick={() => setHasResponded(true)}
              className="p-1 ml-1 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-900 text-white p-3 sm:p-5 md:p-10 font-sans">
        <header className="mb-10 text-center">
          <h1 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight text-blue-100">
            ZenMix
          </h1>
          <p className="text-gray-400">Mix your perfect soundscape.</p>
          <button
            onClick={toggleMute}
            className={`absolute right-1/100 top-1/12 p-3 rounded-full transition-colors duration-300 ${
              isMuted
                ? "bg-red-600 hover:bg-red-700"
                : "bg-white/10 hover:bg-white/20"
            }`}
            aria-label={isMuted ? "Unmute all sounds" : "Mute all sounds"}
          >
            <MuteIcon size={24} className="text-white" />
          </button>
        </header>

        {/* Search Bar */}
        <div className="flex justify-center">
          <input
            placeholder="🔍 Search for sounds"
            className="bg-white/10 hover:bg-white/20 rounded-2xl text-center w-2/5 h-8 mb-10"
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>

        {/* Preset Selector */}
        <PresetSelector
          setActiveSounds={setActiveSounds}
          onSelectPreset={handleSelectPreset}
        />

        {/* Grid */}
        <main className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {sounds.map((sound) => {
            const state = getSoundState(sound.id);
            if (sound.label.toLowerCase().includes(search.toLowerCase())) {
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
            }
          })}
        </main>
      </div>
    </>
  );
}

export default App;
